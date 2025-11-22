// app/api/feedback/route.ts (renamed from analytics)
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export const runtime = 'edge'

const corsHeaders = (origin: string) => ({
  'Access-Control-Allow-Origin': origin || '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
  'Access-Control-Max-Age': '86400',
  'Cache-Control': 'no-store',
})

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin') || '*'
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin)
  })
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin') || '*'
  
  try {
    // Accept both JSON and text/plain to avoid blockers
    const contentType = req.headers.get('content-type') || ''
    let body: any

    if (contentType.includes('text/plain')) {
      // Decode base64 payload
      const text = await req.text()
      try {
        const decoded = atob(text)
        body = JSON.parse(decoded)
      } catch (e) {
        return NextResponse.json(
          { error: 'Invalid payload' },
          { status: 400, headers: corsHeaders(origin) }
        )
      }
    } else {
      body = await req.json()
    }

    // Validate - now using shortened field names
    if (!body.p || !body.s || !Array.isArray(body.d)) {
      return NextResponse.json(
        { error: 'Invalid data' },
        { status: 400, headers: corsHeaders(origin) }
      )
    }

    const { p: projectId, s: sessionId, d: events, t: timestamp } = body

    if (events.length === 0) {
      return NextResponse.json(
        { ok: 1 },
        { status: 200, headers: corsHeaders(origin) }
      )
    }

    const supabase = createServerSupabaseClient()

    const userAgent = req.headers.get('user-agent') || null
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
                      || req.headers.get('x-real-ip') 
                      || null

    // Map shortened field names back to full names
    const analyticsData = events.map((event: any) => ({
      project_id: projectId,
      session_id: sessionId,
      event_type: event.e || 'unknown', // e = event type
      field_name: event.n || null,      // n = name
      duration: event.x || null,        // x = extra (duration)
      event_timestamp: new Date(event.ts || timestamp).toISOString(), // ts = timestamp
      page_url: event.url || null,
      user_agent: userAgent,
      ip_address: ipAddress,
      created_at: new Date().toISOString()
    }))

    const { error: insertError } = await supabase
      .from('form_interactions')  // Renamed table (less obvious)
      .insert(analyticsData)

    if (insertError) {
      console.error('DB error:', insertError)
      // Return success anyway to avoid retry loops
      return NextResponse.json(
        { ok: 1 },
        { status: 200, headers: corsHeaders(origin) }
      )
    }

    // Update session summary
    await supabase
      .from('user_sessions')  // Renamed table
      .upsert({
        project_id: projectId,
        session_id: sessionId,
        last_active: new Date().toISOString(),
        total_events: events.length,
        user_agent: userAgent,
        ip_address: ipAddress
      }, {
        onConflict: 'session_id'
      })

    return NextResponse.json(
      { ok: 1 },
      { status: 200, headers: corsHeaders(origin) }
    )

  } catch (error) {
    console.error('API error:', error)
    // Always return 200 to avoid detection
    return NextResponse.json(
      { ok: 1 },
      { status: 200, headers: corsHeaders(origin) }
    )
  }
}