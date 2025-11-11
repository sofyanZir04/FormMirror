// src/app/api/projects/[id]/insights/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

type Insight = {
  killerField: {
    fieldName: string | null
    visits: number
    abandons: number
    abandonmentRate: number
  } | null
  tips: string[]
  stats: {
    totalEvents: number
    uniqueSessions: number
    submits: number
    abandons: number
    windowDays: number
  }
}

export async function GET(req: NextRequest) {
  const headers = { 'Cache-Control': 'no-store' }

  // Extract projectId from the URL
  // Example URL: /api/projects/<id>/insights
  const segments = req.nextUrl.pathname.split('/')
  const projectId = segments[3] // segments[0]='', [1]='api', [2]='projects', [3]=id

  if (!projectId) {
    return NextResponse.json({ error: 'Missing project id' }, { status: 400, headers })
  }

  try {
    const supabase = createServerSupabaseClient()

    // Last 7 days
    const since = new Date()
    since.setDate(since.getDate() - 7)

    const { data: events, error } = await supabase
      .from('form_events')
      .select('*')
      .eq('project_id', projectId)
      .gte('created_at', since.toISOString())

    if (error) {
      console.error('Failed to fetch events for insights:', error)
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500, headers })
    }

    const uniqueSessions = new Set((events || []).map(e => e.session_id)).size
    const totalEvents = events?.length || 0

    // Aggregate per field
    const perField: Record<
      string,
      { visits: number; abandons: number; totalDuration: number; focusCount: number; inputCount: number; blurCount: number }
    > = {}

    for (const ev of events || []) {
      const key = ev.field_name || 'unknown'
      if (!perField[key]) perField[key] = { visits: 0, abandons: 0, totalDuration: 0, focusCount: 0, inputCount: 0, blurCount: 0 }

      if (ev.event_type === 'focus') perField[key].visits++
      if (ev.event_type === 'abandon') perField[key].abandons++
      if (ev.event_type === 'focus') perField[key].focusCount++
      if (ev.event_type === 'input') perField[key].inputCount++
      if (ev.event_type === 'blur') perField[key].blurCount++
      if (typeof ev.duration === 'number') perField[key].totalDuration += ev.duration
    }

    // Killer field (highest abandonment rate with minimum traffic)
    let killer: Insight['killerField'] = null
    const MIN_VISITS = 5
    for (const [fieldName, m] of Object.entries(perField)) {
      if (m.visits < MIN_VISITS) continue
      const rate = m.visits > 0 ? m.abandons / m.visits : 0
      if (!killer || rate > killer.abandonmentRate) {
        killer = {
          fieldName: fieldName === 'unknown' ? null : fieldName,
          visits: m.visits,
          abandons: m.abandons,
          abandonmentRate: Number(rate.toFixed(2)),
        }
      }
    }

    // Generate tips
    const tips: string[] = []
    const submits = (events || []).filter(e => e.event_type === 'submit').length
    const abandons = (events || []).filter(e => e.event_type === 'abandon').length

    if (killer) {
      tips.push(
        `Make the field “${killer.fieldName || 'Unknown field'}” optional or split it into smaller parts to reduce drop-off (abandonment ${Math.round(
          killer.abandonmentRate * 100,
        )}%).`,
      )
    }

    // Long-duration fields
    for (const [fieldName, m] of Object.entries(perField)) {
      if (m.focusCount === 0) continue
      const avg = m.totalDuration / Math.max(1, m.focusCount)
      if (avg > 10000) {
        tips.push(`Add help text or simplify “${fieldName}” — users spend ~${Math.round(avg / 1000)}s on average here.`)
      }
    }

    // Frequently skipped fields
    for (const [fieldName, m] of Object.entries(perField)) {
      if (m.focusCount >= MIN_VISITS && m.inputCount === 0 && m.blurCount > 0) {
        tips.push(`Consider removing or reordering “${fieldName}” — many users skip it after looking.`)
      }
    }

    if (submits === 0 && abandons > 0) {
      tips.push('No submissions detected — test the submit button and reduce required fields.')
    }

    if (tips.length === 0) {
      tips.push('Great job — no obvious blockers detected this week. Try A/B testing microcopy on labels.')
    }

    const payload: Insight = {
      killerField: killer,
      tips,
      stats: {
        totalEvents,
        uniqueSessions,
        submits,
        abandons,
        windowDays: 7,
      },
    }

    return NextResponse.json(payload, { headers })
  } catch (err: unknown) {
    console.error('Insights error:', err)
    return NextResponse.json({ error: 'Failed to compute insights' }, { status: 500, headers })
  }
}
