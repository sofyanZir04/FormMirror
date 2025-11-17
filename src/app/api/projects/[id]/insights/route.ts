// src/app/api/projects/[id]/insights/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

type FieldMetrics = {
  fieldName: string
  visits: number
  abandons: number
  abandonmentRate: number
  avgDuration: number
  inputCount: number
  blurCount: number
  focusCount: number
  skipRate: number
  hesitationScore: number
}

type SessionMetrics = {
  sessionId: string
  totalDuration: number
  eventCount: number
  fieldsVisited: string[]
  completed: boolean
  abandonedAt?: string
  timeToFirstInteraction: number
  timeToSubmit?: number
}

type InsightResponse = {
  killerField: {
    fieldName: string
    visits: number
    abandons: number
    abandonmentRate: number
    severity: 'critical' | 'high' | 'medium' | 'low'
  } | null
  aiInsights: {
    summary: string
    criticalIssues: Array<{
      issue: string
      impact: string
      recommendation: string
      priority: 'high' | 'medium' | 'low'
    }>
    opportunities: Array<{
      title: string
      description: string
      expectedImpact: string
    }>
    userBehaviorPatterns: Array<{
      pattern: string
      insight: string
    }>
    nextSteps: string[]
  }
  stats: {
    totalEvents: number
    uniqueSessions: number
    submits: number
    abandons: number
    windowDays: number
    avgSessionDuration: number
    completionRate: number
    bounceRate: number
  }
  fieldMetrics: FieldMetrics[]
}

export async function GET(req: NextRequest) {
  const headers = { 'Cache-Control': 'no-store' }
  const days = req.nextUrl.searchParams.get('days') || '7'
  const segments = req.nextUrl.pathname.split('/')  
  const projectId = segments[3]

  if (!projectId) {
    return NextResponse.json({ error: 'Missing project id' }, { status: 400, headers })
  }

  try {
    const supabase = createServerSupabaseClient()

    // Fetch last 7 days of data with timeout handling
    const since = new Date()
    since.setDate(since.getDate() - Number(days))

    console.log(`[Insights] Fetching events for project ${projectId} since ${since.toISOString()}`)

    // Add timeout to the query
    const fetchWithTimeout = Promise.race([
      supabase
        .from('form_events')
        .select('*')
        .eq('project_id', projectId)
        .gte('created_at', since.toISOString())
        .order('created_at', { ascending: true }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), 10000)
      )
    ])

    const { data: events, error } = await fetchWithTimeout as any

    if (error) {
      console.error('[Insights] Failed to fetch events:', error)
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500, headers })
    }

    console.log(`[Insights] Fetched ${events?.length || 0} events`)

    if (!events || events.length === 0) {
      console.log('[Insights] No events found, returning empty state')
      return NextResponse.json({
        killerField: null,
        aiInsights: {
          summary: 'No data available yet. Install the tracking code to start collecting insights.',
          criticalIssues: [],
          opportunities: [],
          userBehaviorPatterns: [],
          nextSteps: ['Add tracking script to your form', 'Test with sample interactions']
        },
        stats: {
          totalEvents: 0,
          uniqueSessions: 0,
          submits: 0,
          abandons: 0,
          windowDays: 7,
          avgSessionDuration: 0,
          completionRate: 0,
          bounceRate: 0
        },
        fieldMetrics: []
      }, { headers })
    }

    console.log(`[Insights] Processing ${events.length} events for AI analysis`)

    // === ADVANCED METRICS CALCULATION ===
    
    // Session-level analysis
    const sessionMap = new Map<string, SessionMetrics>()
    events.forEach(event => {
      if (!sessionMap.has(event.session_id)) {
        sessionMap.set(event.session_id, {
          sessionId: event.session_id,
          totalDuration: 0,
          eventCount: 0,
          fieldsVisited: [],
          completed: false,
          timeToFirstInteraction: 0,
          timeToSubmit: undefined
        })
      }
      
      const session = sessionMap.get(event.session_id)!
      session.eventCount++
      
      if (event.field_name && !session.fieldsVisited.includes(event.field_name)) {
        session.fieldsVisited.push(event.field_name)
      }
      
      if (event.duration) {
        session.totalDuration += event.duration
      }
      
      if (event.event_type === 'submit') {
        session.completed = true
      }
      
      if (event.event_type === 'abandon') {
        session.abandonedAt = event.field_name || undefined
      }
    })

    const sessions = Array.from(sessionMap.values())
    const uniqueSessions = sessions.length
    const submits = sessions.filter(s => s.completed).length
    const abandons = sessions.filter(s => s.abandonedAt).length
    const completionRate = uniqueSessions > 0 ? (submits / uniqueSessions) * 100 : 0
    const avgSessionDuration = sessions.reduce((sum, s) => sum + s.totalDuration, 0) / Math.max(1, uniqueSessions)
    const bounceRate = sessions.filter(s => s.eventCount <= 2).length / Math.max(1, uniqueSessions) * 100

    // Field-level analysis
    const fieldMap = new Map<string, {
      visits: number
      abandons: number
      durations: number[]
      inputCount: number
      blurCount: number
      focusCount: number
      sessionsThatVisited: Set<string>
      sessionsThatAbandoned: Set<string>
    }>()

    events.forEach(event => {
      const fieldName = event.field_name || 'unknown'
      if (!fieldMap.has(fieldName)) {
        fieldMap.set(fieldName, {
          visits: 0,
          abandons: 0,
          durations: [],
          inputCount: 0,
          blurCount: 0,
          focusCount: 0,
          sessionsThatVisited: new Set(),
          sessionsThatAbandoned: new Set()
        })
      }
      
      const field = fieldMap.get(fieldName)!
      
      if (event.event_type === 'focus') {
        field.visits++
        field.focusCount++
        field.sessionsThatVisited.add(event.session_id)
      }
      if (event.event_type === 'abandon') {
        field.abandons++
        field.sessionsThatAbandoned.add(event.session_id)
      }
      if (event.event_type === 'input') field.inputCount++
      if (event.event_type === 'blur') field.blurCount++
      if (event.duration) field.durations.push(event.duration)
    })

    // Calculate field metrics
    const fieldMetrics: FieldMetrics[] = Array.from(fieldMap.entries())
      .filter(([_, data]) => data.visits >= 3) // Minimum threshold
      .map(([fieldName, data]) => {
        const avgDuration = data.durations.length > 0 
          ? data.durations.reduce((a, b) => a + b, 0) / data.durations.length 
          : 0
        const abandonmentRate = data.visits > 0 ? data.abandons / data.visits : 0
        const skipRate = data.focusCount > 0 && data.inputCount === 0 && data.blurCount > 0 
          ? data.blurCount / data.focusCount 
          : 0
        
        // Hesitation score: combination of long duration and low input
        const hesitationScore = avgDuration > 5000 && data.inputCount < data.focusCount * 0.3 
          ? Math.min(1, avgDuration / 20000) 
          : 0

        return {
          fieldName,
          visits: data.visits,
          abandons: data.abandons,
          abandonmentRate: Number(abandonmentRate.toFixed(3)),
          avgDuration: Math.round(avgDuration),
          inputCount: data.inputCount,
          blurCount: data.blurCount,
          focusCount: data.focusCount,
          skipRate: Number(skipRate.toFixed(3)),
          hesitationScore: Number(hesitationScore.toFixed(3))
        }
      })
      .sort((a, b) => b.abandonmentRate - a.abandonmentRate)

    // Identify killer field
    const killerField = fieldMetrics.length > 0 ? {
      fieldName: fieldMetrics[0].fieldName,
      visits: fieldMetrics[0].visits,
      abandons: fieldMetrics[0].abandons,
      abandonmentRate: fieldMetrics[0].abandonmentRate,
      severity: (
        fieldMetrics[0].abandonmentRate > 0.5 ? 'critical' :
        fieldMetrics[0].abandonmentRate > 0.3 ? 'high' :
        fieldMetrics[0].abandonmentRate > 0.15 ? 'medium' : 'low'
      ) as 'critical' | 'high' | 'medium' | 'low'
    } : null

    // === GEMINI AI ANALYSIS ===
    console.log('[Insights] Starting Gemini AI analysis')
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',//gemini-2.0-flash-exp
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    })

    const prompt = `You are an expert UX researcher and form optimization specialist analyzing user behavior data from a web form.

**FORM ANALYTICS DATA:**

Overall Stats (7 days):
- Total Events: ${events.length}
- Unique Sessions: ${uniqueSessions}
- Completion Rate: ${completionRate.toFixed(1)}%
- Average Session Duration: ${Math.round(avgSessionDuration / 1000)}s
- Bounce Rate: ${bounceRate.toFixed(1)}%
- Submits: ${submits}
- Abandons: ${abandons}

Field-Level Metrics:
${fieldMetrics.map(f => `
• ${f.fieldName}:
  - Visits: ${f.visits}, Abandons: ${f.abandons} (${(f.abandonmentRate * 100).toFixed(1)}%)
  - Avg Duration: ${Math.round(f.avgDuration / 1000)}s
  - Input Rate: ${f.inputCount}/${f.focusCount} (${f.focusCount > 0 ? ((f.inputCount / f.focusCount) * 100).toFixed(0) : 0}%)
  - Skip Rate: ${(f.skipRate * 100).toFixed(1)}%
  - Hesitation Score: ${(f.hesitationScore * 100).toFixed(0)}/100
`).join('\n')}

Session Patterns:
- Sessions completing: ${submits}
- Sessions abandoning: ${abandons}
- Average fields visited per session: ${(sessions.reduce((sum, s) => sum + s.fieldsVisited.length, 0) / Math.max(1, uniqueSessions)).toFixed(1)}

**YOUR TASK:**
Analyze this data and provide actionable insights in the following JSON format. Be specific, data-driven, and prioritize high-impact recommendations.

{
  "summary": "2-3 sentence executive summary of form health",
  "criticalIssues": [
    {
      "issue": "Specific problem identified",
      "impact": "Quantified business impact",
      "recommendation": "Concrete, actionable fix",
      "priority": "high" | "medium" | "low"
    }
  ],
  "opportunities": [
    {
      "title": "Opportunity name",
      "description": "What to do",
      "expectedImpact": "Estimated improvement"
    }
  ],
  "userBehaviorPatterns": [
    {
      "pattern": "Observed behavior",
      "insight": "What it means for UX"
    }
  ],
  "nextSteps": ["Step 1", "Step 2", "Step 3"]
}

Focus on:
1. Fields with high abandonment or hesitation
2. Completion funnel bottlenecks
3. User experience friction points
4. Quick wins vs. strategic improvements
5. A/B test suggestions

Respond ONLY with valid JSON, no markdown formatting.`

    let aiInsights
    try {
      console.log('[Insights] Calling Gemini API...')
      const result = await Promise.race([
        model.generateContent(prompt),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Gemini API timeout')), 15000)
        )
      ]) as any

      const text = result.response.text().trim()
      console.log('[Insights] Gemini raw response:', text.substring(0, 200) + '...')
      
      // Remove potential markdown code blocks
      const cleanJson = text.replace(/```json\n?|\n?```/g, '').trim()
      aiInsights = JSON.parse(cleanJson)
      console.log('[Insights] Successfully parsed Gemini response')
    } catch (aiError: any) {
      console.error('[Insights] Gemini API error:', aiError.message)
      // Fallback to rule-based insights
      aiInsights = generateFallbackInsights(
        fieldMetrics, 
        killerField, 
        uniqueSessions, 
        completionRate, 
        submits, 
        abandons
      )
      console.log('[Insights] Using fallback insights')
    }

    const response: InsightResponse = {
      killerField,
      aiInsights,
      stats: {
        totalEvents: events.length,
        uniqueSessions,
        submits,
        abandons,
        windowDays: 7,
        avgSessionDuration: Math.round(avgSessionDuration),
        completionRate: Number(completionRate.toFixed(1)),
        bounceRate: Number(bounceRate.toFixed(1))
      },
      fieldMetrics
    }

    return NextResponse.json(response, { headers })
  } catch (err) {
    console.error('[Insights] Unhandled error:', err)
    return NextResponse.json({ error: 'Failed to compute insights' }, { status: 500, headers })
  }
}

// Fallback insights generator when AI fails
function generateFallbackInsights(
  fieldMetrics: FieldMetrics[],
  killerField: any,
  uniqueSessions: number,
  completionRate: number,
  submits: number,
  abandons: number
) {
  const criticalIssues: any[] = []
  const opportunities: any[] = []
  const patterns: any[] = []
  const nextSteps: string[] = []

  // Analyze killer field
  if (killerField && killerField.abandonmentRate > 0.3) {
    criticalIssues.push({
      issue: `Critical drop-off at "${killerField.fieldName}" field`,
      impact: `${Math.round(killerField.abandonmentRate * 100)}% of users abandon here (${killerField.abandons} users)`,
      recommendation: 'Make this field optional, add inline help text, or split into smaller steps',
      priority: 'high'
    })
  }

  // Check for long duration fields
  const slowFields = fieldMetrics.filter(f => f.avgDuration > 10000 && f.visits >= 5)
  if (slowFields.length > 0) {
    criticalIssues.push({
      issue: `Users spending excessive time on ${slowFields.length} field(s)`,
      impact: `Average ${Math.round(slowFields[0].avgDuration / 1000)}s on "${slowFields[0].fieldName}" suggests confusion`,
      recommendation: 'Add placeholder examples, help tooltips, or inline validation',
      priority: 'medium'
    })
  }

  // Check completion rate
  if (completionRate < 30 && uniqueSessions >= 10) {
    opportunities.push({
      title: 'Low Completion Rate',
      description: `Only ${Math.round(completionRate)}% of users complete the form`,
      expectedImpact: 'Improving by 10-20% could significantly boost conversions'
    })
  }

  // Check for skipped fields
  const skippedFields = fieldMetrics.filter(f => f.skipRate > 0.5 && f.visits >= 5)
  if (skippedFields.length > 0) {
    patterns.push({
      pattern: `Users frequently skip ${skippedFields.length} field(s) after viewing`,
      insight: 'These fields may be confusing, intimidating, or perceived as unnecessary'
    })
  }

  // Check hesitation
  const hesitantFields = fieldMetrics.filter(f => f.hesitationScore > 0.5)
  if (hesitantFields.length > 0) {
    patterns.push({
      pattern: 'High hesitation detected on multiple fields',
      insight: 'Users are uncertain about what to enter or how to format their input'
    })
  }

  // Generate next steps
  if (criticalIssues.length > 0) {
    nextSteps.push(`Address the "${fieldMetrics[0]?.fieldName}" field first - it has the highest impact`)
  }
  
  nextSteps.push('A/B test simplified versions of your top 3 problem fields')
  nextSteps.push('Add progress indicators to reduce abandonment anxiety')
  
  if (completionRate < 50) {
    nextSteps.push('Consider reducing the number of required fields')
  }

  return {
    summary: `Your form has ${uniqueSessions} sessions with a ${Math.round(completionRate)}% completion rate. ${
      criticalIssues.length > 0 
        ? `${criticalIssues.length} critical issue(s) detected requiring immediate attention.` 
        : 'Overall performance is solid, but there are opportunities for optimization.'
    }`,
    criticalIssues,
    opportunities,
    userBehaviorPatterns: patterns,
    nextSteps: nextSteps.slice(0, 5)
  }
}



// ----------------------------------------------------------------------------------Start
// import { NextRequest } from 'next/server';
// import { NextResponse } from 'next/server';
// import { createServerSupabaseClient } from '@/lib/supabase'; // Adjust path as needed
// import { genAI } from '@/lib/gemini'; // Adjust path as needed

// // Types (optional but recommended)
// interface SessionMetrics {
//   sessionId: string;
//   totalDuration: number;
//   eventCount: number;
//   fieldsVisited: string[];
//   completed: boolean;
//   abandonedAt?: string;
//   timeToFirstInteraction: number;
//   timeToSubmit?: number;
// }

// interface FieldMetrics {
//   fieldName: string;
//   visits: number;
//   abandons: number;
//   abandonmentRate: number;
//   avgDuration: number;
//   inputCount: number;
//   blurCount: number;
//   focusCount: number;
//   skipRate: number;
//   hesitationScore: number;
// }

// interface InsightResponse {
//   killerField: {
//     fieldName: string;
//     visits: number;
//     abandons: number;
//     abandonmentRate: number;
//     severity: 'critical' | 'high' | 'medium' | 'low';
//   } | null;
//   aiInsights: {
//     summary: string;
//     criticalIssues: Array<{
//       issue: string;
//       impact: string;
//       recommendation: string;
//       priority: 'high' | 'medium' | 'low';
//     }>;
//     opportunities: Array<{
//       title: string;
//       description: string;
//       expectedImpact: string;
//     }>;
//     userBehaviorPatterns: Array<{
//       pattern: string;
//       insight: string;
//     }>;
//     nextSteps: string[];
//   };
//   stats: {
//     totalEvents: number;
//     uniqueSessions: number;
//     submits: number;
//     abandons: number;
//     windowDays: number;
//     avgSessionDuration: number;
//     completionRate: number;
//     bounceRate: number;
//   };
//   fieldMetrics: FieldMetrics[];
// }

// export async function GET(req: NextRequest) {
//   const headers = { 'Cache-Control': 'no-store' };
//   const segments = req.nextUrl.pathname.split('/');
//   const projectId = segments[3];

//   if (!projectId) {
//     return NextResponse.json({ error: 'Missing project id' }, { status: 400, headers });
//   }

//   try {
//     const supabase = createServerSupabaseClient();

//     const since = new Date();
//     since.setDate(since.getDate() - 7);
//     const sinceIso = since.toISOString();
//     console.log('Since ISO: 😅😅😅', sinceIso);

//     console.log(`[Insights] Fetching events for project ${projectId} since ${since.toISOString()}`);

//     // ✅ Fixed: Await the query INSIDE the race
//     const fetchWithTimeout = Promise.race([
//       (async () => {
//         const { data, error } = await supabase
//           .from('form_events')
//           .select('*')
//           .eq('project_id', projectId)
//           .gte('created_at', sinceIso)
//           .order('created_at', { ascending: true });

//         if (error) {
//           throw new Error(`Supabase error: ${error.message}`);
//         }
//         return data; // This is the actual array of events
//       })(),
//       new Promise<never>((_, reject) =>
//         setTimeout(() => reject(new Error('Query timeout after 10s')), 10000)
//       ),
//     ]);

//     let events: any[];
//     try {
//       events = await fetchWithTimeout;
//     } catch (err: any) {
//       console.error('[Insights] Query failed:', err);
//       return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500, headers });
//     }

//     console.log(`[Insights] Fetched ${events.length} events`);

//     if (events.length === 0) {
//       console.log('[Insights] No events found, returning empty state');
//       return NextResponse.json({
//         killerField: null,
//         aiInsights: {
//           summary: 'No data available yet. Install the tracking code to start collecting insights.',
//           criticalIssues: [],
//           opportunities: [],
//           userBehaviorPatterns: [],
//           nextSteps: ['Add tracking script to your form', 'Test with sample interactions'],
//         },
//         stats: {
//           totalEvents: 0,
//           uniqueSessions: 0,
//           submits: 0,
//           abandons: 0,
//           windowDays: 7,
//           avgSessionDuration: 0,
//           completionRate: 0,
//           bounceRate: 0,
//         },
//         fieldMetrics: [],
//       }, { headers });
//     }

//     console.log(`[Insights] Processing ${events.length} events for AI analysis`);

//     // === ADVANCED METRICS CALCULATION ===
//     const sessionMap = new Map<string, SessionMetrics>();
//     events.forEach((event) => {
//       if (!sessionMap.has(event.session_id)) {
//         sessionMap.set(event.session_id, {
//           sessionId: event.session_id,
//           totalDuration: 0,
//           eventCount: 0,
//           fieldsVisited: [],
//           completed: false,
//           timeToFirstInteraction: 0,
//         });
//       }

//       const session = sessionMap.get(event.session_id)!;
//       session.eventCount++;

//       if (event.field_name && !session.fieldsVisited.includes(event.field_name)) {
//         session.fieldsVisited.push(event.field_name);
//       }

//       if (event.duration) {
//         session.totalDuration += event.duration;
//       }

//       if (event.event_type === 'submit') {
//         session.completed = true;
//       }

//       if (event.event_type === 'abandon') {
//         session.abandonedAt = event.field_name || undefined;
//       }
//     });

//     const sessions = Array.from(sessionMap.values());
//     const uniqueSessions = sessions.length;
//     const submits = sessions.filter((s) => s.completed).length;
//     const abandons = sessions.filter((s) => s.abandonedAt).length;
//     const completionRate = uniqueSessions > 0 ? (submits / uniqueSessions) * 100 : 0;
//     const avgSessionDuration = sessions.reduce((sum, s) => sum + s.totalDuration, 0) / Math.max(1, uniqueSessions);
//     const bounceRate = (sessions.filter((s) => s.eventCount <= 2).length / Math.max(1, uniqueSessions)) * 100;

//     // Field-level analysis
//     const fieldMap = new Map<
//       string,
//       {
//         visits: number;
//         abandons: number;
//         durations: number[];
//         inputCount: number;
//         blurCount: number;
//         focusCount: number;
//         sessionsThatVisited: Set<string>;
//         sessionsThatAbandoned: Set<string>;
//       }
//     >();

//     events.forEach((event) => {
//       const fieldName = event.field_name || 'unknown';
//       if (!fieldMap.has(fieldName)) {
//         fieldMap.set(fieldName, {
//           visits: 0,
//           abandons: 0,
//           durations: [],
//           inputCount: 0,
//           blurCount: 0,
//           focusCount: 0,
//           sessionsThatVisited: new Set(),
//           sessionsThatAbandoned: new Set(),
//         });
//       }

//       const field = fieldMap.get(fieldName)!;

//       if (event.event_type === 'focus') {
//         field.visits++;
//         field.focusCount++;
//         field.sessionsThatVisited.add(event.session_id);
//       }
//       if (event.event_type === 'abandon') {
//         field.abandons++;
//         field.sessionsThatAbandoned.add(event.session_id);
//       }
//       if (event.event_type === 'input') field.inputCount++;
//       if (event.event_type === 'blur') field.blurCount++;
//       if (event.duration) field.durations.push(event.duration);
//     });

//     const fieldMetrics: FieldMetrics[] = Array.from(fieldMap.entries())
//       .filter(([, data]) => data.visits >= 3)
//       .map(([fieldName, data]) => {
//         const avgDuration = data.durations.length > 0
//           ? data.durations.reduce((a, b) => a + b, 0) / data.durations.length
//           : 0;
//         const abandonmentRate = data.visits > 0 ? data.abandons / data.visits : 0;
//         const skipRate =
//           data.focusCount > 0 && data.inputCount === 0 && data.blurCount > 0
//             ? data.blurCount / data.focusCount
//             : 0;

//         const hesitationScore = avgDuration > 5000 && data.inputCount < data.focusCount * 0.3
//           ? Math.min(1, avgDuration / 20000)
//           : 0;

//         return {
//           fieldName,
//           visits: data.visits,
//           abandons: data.abandons,
//           abandonmentRate: Number(abandonmentRate.toFixed(3)),
//           avgDuration: Math.round(avgDuration),
//           inputCount: data.inputCount,
//           blurCount: data.blurCount,
//           focusCount: data.focusCount,
//           skipRate: Number(skipRate.toFixed(3)),
//           hesitationScore: Number(hesitationScore.toFixed(3)),
//         };
//       })
//       .sort((a, b) => b.abandonmentRate - a.abandonmentRate);

//     const killerField = fieldMetrics.length > 0
//       ? {
//           fieldName: fieldMetrics[0].fieldName,
//           visits: fieldMetrics[0].visits,
//           abandons: fieldMetrics[0].abandons,
//           abandonmentRate: fieldMetrics[0].abandonmentRate,
//           severity: (
//             fieldMetrics[0].abandonmentRate > 0.5
//               ? 'critical'
//               : fieldMetrics[0].abandonmentRate > 0.3
//               ? 'high'
//               : fieldMetrics[0].abandonmentRate > 0.15
//               ? 'medium'
//               : 'low'
//           ) as 'critical' | 'high' | 'medium' | 'low',
//         }
//       : null;

//     // === GEMINI AI ANALYSIS ===
//     const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });


//     const prompt = `You are an expert UX researcher and form optimization specialist analyzing user behavior data from a web form.

// **FORM ANALYTICS DATA:**

// Overall Stats (7 days):
// - Total Events: ${events.length}
// - Unique Sessions: ${uniqueSessions}
// - Completion Rate: ${completionRate.toFixed(1)}%
// - Average Session Duration: ${Math.round(avgSessionDuration / 1000)}s
// - Bounce Rate: ${bounceRate.toFixed(1)}%
// - Submits: ${submits}
// - Abandons: ${abandons}

// Field-Level Metrics:
// ${fieldMetrics
//   .map(
//     (f) => `
// • ${f.fieldName}:
//   - Visits: ${f.visits}, Abandons: ${f.abandons} (${(f.abandonmentRate * 100).toFixed(1)}%)
//   - Avg Duration: ${Math.round(f.avgDuration / 1000)}s
//   - Input Rate: ${f.inputCount}/${f.focusCount} (${f.focusCount > 0 ? ((f.inputCount / f.focusCount) * 100).toFixed(0) : 0}%)
//   - Skip Rate: ${(f.skipRate * 100).toFixed(1)}%
//   - Hesitation Score: ${(f.hesitationScore * 100).toFixed(0)}/100
// `
//   )
//   .join('\n')}

// Session Patterns:
// - Sessions completing: ${submits}
// - Sessions abandoning: ${abandons}
// - Average fields visited per session: ${(sessions.reduce((sum, s) => sum + s.fieldsVisited.length, 0) / Math.max(1, uniqueSessions)).toFixed(1)}

// **YOUR TASK:**
// Analyze this data and provide actionable insights in the following JSON format. Be specific, data-driven, and prioritize high-impact recommendations.

// {
//   "summary": "2-3 sentence executive summary of form health",
//   "criticalIssues": [
//     {
//       "issue": "Specific problem identified",
//       "impact": "Quantified business impact",
//       "recommendation": "Concrete, actionable fix",
//       "priority": "high" | "medium" | "low"
//     }
//   ],
//   "opportunities": [
//     {
//       "title": "Opportunity name",
//       "description": "What to do",
//       "expectedImpact": "Estimated improvement"
//     }
//   ],
//   "userBehaviorPatterns": [
//     {
//       "pattern": "Observed behavior",
//       "insight": "What it means for UX"
//     }
//   ],
//   "nextSteps": ["Step 1", "Step 2", "Step 3"]
// }

// Focus on:
// 1. Fields with high abandonment or hesitation
// 2. Completion funnel bottlenecks
// 3. User experience friction points
// 4. Quick wins vs. strategic improvements
// 5. A/B test suggestions

// Respond ONLY with valid JSON, no markdown formatting.`;

//     let aiInsights;
//     try {
//       const result = await model.generateContent(prompt);
//       const text = result.response.text().trim();
//       const cleanJson = text.replace(/```json\n?|\n?```/g, '').trim();
//       aiInsights = JSON.parse(cleanJson);
//       console.log('[Insights] Gemini AI insights generated successfully');
//     } catch (aiError) {
//       console.error('Gemini API error:', aiError);
//       aiInsights = {
//         summary: `Your form has ${uniqueSessions} sessions with a ${completionRate.toFixed(1)}% completion rate over the past 7 days.`,
//         criticalIssues: killerField
//           ? [
//               {
//                 issue: `High abandonment on "${killerField.fieldName}"`,
//                 impact: `${killerField.abandons} users dropped off at this field`,
//                 recommendation: 'Consider making it optional or splitting into smaller inputs',
//                 priority: 'high',
//               },
//             ]
//           : [],
//         opportunities: [],
//         userBehaviorPatterns: [],
//         nextSteps: ['Review field labels for clarity', 'Test form on mobile devices'],
//       };
//     }

//     const response: InsightResponse = {
//       killerField,
//       aiInsights,
//       stats: {
//         totalEvents: events.length,
//         uniqueSessions,
//         submits,
//         abandons,
//         windowDays: 7,
//         avgSessionDuration: Math.round(avgSessionDuration),
//         completionRate: Number(completionRate.toFixed(1)),
//         bounceRate: Number(bounceRate.toFixed(1)),
//       },
//       fieldMetrics,
//     };

//     return NextResponse.json(response, { headers });
//   } catch (err) {
//     console.error('Insights error:', err);
//     return NextResponse.json({ error: 'Failed to compute insights' }, { status: 500, headers });
//   }
// }

// End

// import { NextRequest, NextResponse } from 'next/server'
// import { createServerSupabaseClient } from '@/lib/supabase'
// import { GoogleGenerativeAI } from '@google/generative-ai'

// // Initialize Gemini
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// type FieldMetrics = {
//   fieldName: string
//   visits: number
//   abandons: number
//   abandonmentRate: number
//   avgDuration: number
//   inputCount: number
//   blurCount: number
//   focusCount: number
//   skipRate: number
//   hesitationScore: number
// }

// type SessionMetrics = {
//   sessionId: string
//   totalDuration: number
//   eventCount: number
//   fieldsVisited: string[]
//   completed: boolean
//   abandonedAt?: string
//   timeToFirstInteraction: number
//   timeToSubmit?: number
// }

// type InsightResponse = {
//   killerField: {
//     fieldName: string
//     visits: number
//     abandons: number
//     abandonmentRate: number
//     severity: 'critical' | 'high' | 'medium' | 'low'
//   } | null
//   aiInsights: {
//     summary: string
//     criticalIssues: Array<{
//       issue: string
//       impact: string
//       recommendation: string
//       priority: 'high' | 'medium' | 'low'
//     }>
//     opportunities: Array<{
//       title: string
//       description: string
//       expectedImpact: string
//     }>
//     userBehaviorPatterns: Array<{
//       pattern: string
//       insight: string
//     }>
//     nextSteps: string[]
//   }
//   stats: {
//     totalEvents: number
//     uniqueSessions: number
//     submits: number
//     abandons: number
//     windowDays: number
//     avgSessionDuration: number
//     completionRate: number
//     bounceRate: number
//   }
//   fieldMetrics: FieldMetrics[]
// }

// export async function GET(req: NextRequest) {
//   const headers = { 'Cache-Control': 'no-store' }
//   const segments = req.nextUrl.pathname.split('/')
//   const projectId = segments[3]

//   if (!projectId) {
//     return NextResponse.json({ error: 'Missing project id' }, { status: 400, headers })
//   }

//   try {
//     const supabase = createServerSupabaseClient()

//     // Fetch last 7 days of data with timeout handling
//     const since = new Date()
//     since.setDate(since.getDate() - 7)

//     console.log(`[Insights] Fetching events for project ${projectId} since ${since.toISOString()}`)

//     // Add timeout to the query
//     const fetchWithTimeout = Promise.race([
//       supabase
//         .from('form_events')
//         .select('*')
//         .eq('project_id', projectId)
//         .gte('created_at', since.toISOString())
//         .order('created_at', { ascending: true }),
//       new Promise((_, reject) => 
//         setTimeout(() => reject(new Error('Query timeout')), 10000)
//       )
//     ])

//     const { data: events, error } = await fetchWithTimeout as any

//     if (error) {
//       console.error('[Insights] Failed to fetch events:', error)
//       return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500, headers })
//     }

//     console.log(`[Insights] Fetched ${events?.length || 0} events`)

//     if (!events || events.length === 0) {
//       console.log('[Insights] No events found, returning empty state')
//       return NextResponse.json({
//         killerField: null,
//         aiInsights: {
//           summary: 'No data available yet. Install the tracking code to start collecting insights.',
//           criticalIssues: [],
//           opportunities: [],
//           userBehaviorPatterns: [],
//           nextSteps: ['Add tracking script to your form', 'Test with sample interactions']
//         },
//         stats: {
//           totalEvents: 0,
//           uniqueSessions: 0,
//           submits: 0,
//           abandons: 0,
//           windowDays: 7,
//           avgSessionDuration: 0,
//           completionRate: 0,
//           bounceRate: 0
//         },
//         fieldMetrics: []
//       }, { headers })
//     }

//     console.log(`[Insights] Processing ${events.length} events for AI analysis`)

//     // === ADVANCED METRICS CALCULATION ===
    
//     // Session-level analysis
//     const sessionMap = new Map<string, SessionMetrics>()
//     events.forEach(event => {
//       if (!sessionMap.has(event.session_id)) {
//         sessionMap.set(event.session_id, {
//           sessionId: event.session_id,
//           totalDuration: 0,
//           eventCount: 0,
//           fieldsVisited: [],
//           completed: false,
//           timeToFirstInteraction: 0,
//           timeToSubmit: undefined
//         })
//       }
      
//       const session = sessionMap.get(event.session_id)!
//       session.eventCount++
      
//       if (event.field_name && !session.fieldsVisited.includes(event.field_name)) {
//         session.fieldsVisited.push(event.field_name)
//       }
      
//       if (event.duration) {
//         session.totalDuration += event.duration
//       }
      
//       if (event.event_type === 'submit') {
//         session.completed = true
//       }
      
//       if (event.event_type === 'abandon') {
//         session.abandonedAt = event.field_name || undefined
//       }
//     })

//     const sessions = Array.from(sessionMap.values())
//     const uniqueSessions = sessions.length
//     const submits = sessions.filter(s => s.completed).length
//     const abandons = sessions.filter(s => s.abandonedAt).length
//     const completionRate = uniqueSessions > 0 ? (submits / uniqueSessions) * 100 : 0
//     const avgSessionDuration = sessions.reduce((sum, s) => sum + s.totalDuration, 0) / Math.max(1, uniqueSessions)
//     const bounceRate = sessions.filter(s => s.eventCount <= 2).length / Math.max(1, uniqueSessions) * 100

//     // Field-level analysis
//     const fieldMap = new Map<string, {
//       visits: number
//       abandons: number
//       durations: number[]
//       inputCount: number
//       blurCount: number
//       focusCount: number
//       sessionsThatVisited: Set<string>
//       sessionsThatAbandoned: Set<string>
//     }>()

//     events.forEach(event => {
//       const fieldName = event.field_name || 'unknown'
//       if (!fieldMap.has(fieldName)) {
//         fieldMap.set(fieldName, {
//           visits: 0,
//           abandons: 0,
//           durations: [],
//           inputCount: 0,
//           blurCount: 0,
//           focusCount: 0,
//           sessionsThatVisited: new Set(),
//           sessionsThatAbandoned: new Set()
//         })
//       }
      
//       const field = fieldMap.get(fieldName)!
      
//       if (event.event_type === 'focus') {
//         field.visits++
//         field.focusCount++
//         field.sessionsThatVisited.add(event.session_id)
//       }
//       if (event.event_type === 'abandon') {
//         field.abandons++
//         field.sessionsThatAbandoned.add(event.session_id)
//       }
//       if (event.event_type === 'input') field.inputCount++
//       if (event.event_type === 'blur') field.blurCount++
//       if (event.duration) field.durations.push(event.duration)
//     })

//     // Calculate field metrics
//     const fieldMetrics: FieldMetrics[] = Array.from(fieldMap.entries())
//       .filter(([_, data]) => data.visits >= 3) // Minimum threshold
//       .map(([fieldName, data]) => {
//         const avgDuration = data.durations.length > 0 
//           ? data.durations.reduce((a, b) => a + b, 0) / data.durations.length 
//           : 0
//         const abandonmentRate = data.visits > 0 ? data.abandons / data.visits : 0
//         const skipRate = data.focusCount > 0 && data.inputCount === 0 && data.blurCount > 0 
//           ? data.blurCount / data.focusCount 
//           : 0
        
//         // Hesitation score: combination of long duration and low input
//         const hesitationScore = avgDuration > 5000 && data.inputCount < data.focusCount * 0.3 
//           ? Math.min(1, avgDuration / 20000) 
//           : 0

//         return {
//           fieldName,
//           visits: data.visits,
//           abandons: data.abandons,
//           abandonmentRate: Number(abandonmentRate.toFixed(3)),
//           avgDuration: Math.round(avgDuration),
//           inputCount: data.inputCount,
//           blurCount: data.blurCount,
//           focusCount: data.focusCount,
//           skipRate: Number(skipRate.toFixed(3)),
//           hesitationScore: Number(hesitationScore.toFixed(3))
//         }
//       })
//       .sort((a, b) => b.abandonmentRate - a.abandonmentRate)

//     // Identify killer field
//     const killerField = fieldMetrics.length > 0 ? {
//       fieldName: fieldMetrics[0].fieldName,
//       visits: fieldMetrics[0].visits,
//       abandons: fieldMetrics[0].abandons,
//       abandonmentRate: fieldMetrics[0].abandonmentRate,
//       severity: (
//         fieldMetrics[0].abandonmentRate > 0.5 ? 'critical' :
//         fieldMetrics[0].abandonmentRate > 0.3 ? 'high' :
//         fieldMetrics[0].abandonmentRate > 0.15 ? 'medium' : 'low'
//       ) as 'critical' | 'high' | 'medium' | 'low'
//     } : null

//     // === GEMINI AI ANALYSIS ===
//     const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

//     const prompt = `You are an expert UX researcher and form optimization specialist analyzing user behavior data from a web form.

// **FORM ANALYTICS DATA:**

// Overall Stats (7 days):
// - Total Events: ${events.length}
// - Unique Sessions: ${uniqueSessions}
// - Completion Rate: ${completionRate.toFixed(1)}%
// - Average Session Duration: ${Math.round(avgSessionDuration / 1000)}s
// - Bounce Rate: ${bounceRate.toFixed(1)}%
// - Submits: ${submits}
// - Abandons: ${abandons}

// Field-Level Metrics:
// ${fieldMetrics.map(f => `
// • ${f.fieldName}:
//   - Visits: ${f.visits}, Abandons: ${f.abandons} (${(f.abandonmentRate * 100).toFixed(1)}%)
//   - Avg Duration: ${Math.round(f.avgDuration / 1000)}s
//   - Input Rate: ${f.inputCount}/${f.focusCount} (${f.focusCount > 0 ? ((f.inputCount / f.focusCount) * 100).toFixed(0) : 0}%)
//   - Skip Rate: ${(f.skipRate * 100).toFixed(1)}%
//   - Hesitation Score: ${(f.hesitationScore * 100).toFixed(0)}/100
// `).join('\n')}

// Session Patterns:
// - Sessions completing: ${submits}
// - Sessions abandoning: ${abandons}
// - Average fields visited per session: ${(sessions.reduce((sum, s) => sum + s.fieldsVisited.length, 0) / Math.max(1, uniqueSessions)).toFixed(1)}

// **YOUR TASK:**
// Analyze this data and provide actionable insights in the following JSON format. Be specific, data-driven, and prioritize high-impact recommendations.

// {
//   "summary": "2-3 sentence executive summary of form health",
//   "criticalIssues": [
//     {
//       "issue": "Specific problem identified",
//       "impact": "Quantified business impact",
//       "recommendation": "Concrete, actionable fix",
//       "priority": "high" | "medium" | "low"
//     }
//   ],
//   "opportunities": [
//     {
//       "title": "Opportunity name",
//       "description": "What to do",
//       "expectedImpact": "Estimated improvement"
//     }
//   ],
//   "userBehaviorPatterns": [
//     {
//       "pattern": "Observed behavior",
//       "insight": "What it means for UX"
//     }
//   ],
//   "nextSteps": ["Step 1", "Step 2", "Step 3"]
// }

// Focus on:
// 1. Fields with high abandonment or hesitation
// 2. Completion funnel bottlenecks
// 3. User experience friction points
// 4. Quick wins vs. strategic improvements
// 5. A/B test suggestions

// Respond ONLY with valid JSON, no markdown formatting.`

//     let aiInsights
//     try {
//       const result = await model.generateContent(prompt)
//       const text = result.response.text().trim()
//       // Remove potential markdown code blocks
//       const cleanJson = text.replace(/```json\n?|\n?```/g, '').trim()
//       aiInsights = JSON.parse(cleanJson)
//     } catch (aiError) {
//       console.error('Gemini API error:', aiError)
//       // Fallback to basic insights
//       aiInsights = {
//         summary: `Your form has ${uniqueSessions} sessions with a ${completionRate.toFixed(1)}% completion rate over the past 7 days.`,
//         criticalIssues: killerField ? [{
//           issue: `High abandonment on "${killerField.fieldName}"`,
//           impact: `${killerField.abandons} users dropped off at this field`,
//           recommendation: 'Consider making it optional or splitting into smaller inputs',
//           priority: 'high'
//         }] : [],
//         opportunities: [],
//         userBehaviorPatterns: [],
//         nextSteps: ['Review field labels for clarity', 'Test form on mobile devices']
//       }
//     }

//     const response: InsightResponse = {
//       killerField,
//       aiInsights,
//       stats: {
//         totalEvents: events.length,
//         uniqueSessions,
//         submits,
//         abandons,
//         windowDays: 7,
//         avgSessionDuration: Math.round(avgSessionDuration),
//         completionRate: Number(completionRate.toFixed(1)),
//         bounceRate: Number(bounceRate.toFixed(1))
//       },
//       fieldMetrics
//     }

//     return NextResponse.json(response, { headers })
//   } catch (err) {
//     console.error('Insights error:', err)
//     return NextResponse.json({ error: 'Failed to compute insights' }, { status: 500, headers })
//   }
// }

// src/app/api/projects/[id]/insights/route.ts
// import { NextRequest, NextResponse } from 'next/server'
// import { createServerSupabaseClient } from '@/lib/supabase'

// type Insight = {
//   killerField: {
//     fieldName: string | null
//     visits: number
//     abandons: number
//     abandonmentRate: number
//   } | null
//   tips: string[]
//   stats: {
//     totalEvents: number
//     uniqueSessions: number
//     submits: number
//     abandons: number
//     windowDays: number
//   }
// }

// export async function GET(req: NextRequest) {
//   const headers = { 'Cache-Control': 'no-store' }

//   // Extract projectId from the URL
//   // Example URL: /api/projects/<id>/insights
//   const segments = req.nextUrl.pathname.split('/')
//   const projectId = segments[3] // segments[0]='', [1]='api', [2]='projects', [3]=id

//   if (!projectId) {
//     return NextResponse.json({ error: 'Missing project id' }, { status: 400, headers })
//   }

//   try {
//     const supabase = createServerSupabaseClient()

//     // Last 7 days
//     const since = new Date()
//     since.setDate(since.getDate() - 7)

//     const { data: events, error } = await supabase
//       .from('form_events')
//       .select('*')
//       .eq('project_id', projectId)
//       .gte('created_at', since.toISOString())

//     if (error) {
//       console.error('Failed to fetch events for insights:', error)
//       return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500, headers })
//     }

//     const uniqueSessions = new Set((events || []).map(e => e.session_id)).size
//     const totalEvents = events?.length || 0

//     // Aggregate per field
//     const perField: Record<
//       string,
//       { visits: number; abandons: number; totalDuration: number; focusCount: number; inputCount: number; blurCount: number }
//     > = {}

//     for (const ev of events || []) {
//       const key = ev.field_name || 'unknown'
//       if (!perField[key]) perField[key] = { visits: 0, abandons: 0, totalDuration: 0, focusCount: 0, inputCount: 0, blurCount: 0 }

//       if (ev.event_type === 'focus') perField[key].visits++
//       if (ev.event_type === 'abandon') perField[key].abandons++
//       if (ev.event_type === 'focus') perField[key].focusCount++
//       if (ev.event_type === 'input') perField[key].inputCount++
//       if (ev.event_type === 'blur') perField[key].blurCount++
//       if (typeof ev.duration === 'number') perField[key].totalDuration += ev.duration
//     }

//     // Killer field (highest abandonment rate with minimum traffic)
//     let killer: Insight['killerField'] = null
//     const MIN_VISITS = 5
//     for (const [fieldName, m] of Object.entries(perField)) {
//       if (m.visits < MIN_VISITS) continue
//       const rate = m.visits > 0 ? m.abandons / m.visits : 0
//       if (!killer || rate > killer.abandonmentRate) {
//         killer = {
//           fieldName: fieldName === 'unknown' ? null : fieldName,
//           visits: m.visits,
//           abandons: m.abandons,
//           abandonmentRate: Number(rate.toFixed(2)),
//         }
//       }
//     }

//     // Generate tips
//     const tips: string[] = []
//     const submits = (events || []).filter(e => e.event_type === 'submit').length
//     const abandons = (events || []).filter(e => e.event_type === 'abandon').length

//     if (killer) {
//       tips.push(
//         `Make the field “${killer.fieldName || 'Unknown field'}” optional or split it into smaller parts to reduce drop-off (abandonment ${Math.round(
//           killer.abandonmentRate * 100,
//         )}%).`,
//       )
//     }

//     // Long-duration fields
//     for (const [fieldName, m] of Object.entries(perField)) {
//       if (m.focusCount === 0) continue
//       const avg = m.totalDuration / Math.max(1, m.focusCount)
//       if (avg > 10000) {
//         tips.push(`Add help text or simplify “${fieldName}” — users spend ~${Math.round(avg / 1000)}s on average here.`)
//       }
//     }

//     // Frequently skipped fields
//     for (const [fieldName, m] of Object.entries(perField)) {
//       if (m.focusCount >= MIN_VISITS && m.inputCount === 0 && m.blurCount > 0) {
//         tips.push(`Consider removing or reordering “${fieldName}” — many users skip it after looking.`)
//       }
//     }

//     if (submits === 0 && abandons > 0) {
//       tips.push('No submissions detected — test the submit button and reduce required fields.')
//     }

//     if (tips.length === 0) {
//       tips.push('Great job — no obvious blockers detected this week. Try A/B testing microcopy on labels.')
//     }

//     const payload: Insight = {
//       killerField: killer,
//       tips,
//       stats: {
//         totalEvents,
//         uniqueSessions,
//         submits,
//         abandons,
//         windowDays: 7,
//       },
//     }

//     return NextResponse.json(payload, { headers })
//   } catch (err: unknown) {
//     console.error('Insights error:', err)
//     return NextResponse.json({ error: 'Failed to compute insights' }, { status: 500, headers })
//   }
// }
