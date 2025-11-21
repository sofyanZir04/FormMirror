// app/api/analytics/route.ts
import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  // Respond immediately to prevent binding abort
  const immediateResponse = new Response(null, {
    status: 204,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Timing-Allow-Origin': '*',
    },
  })

  // Process data asynchronously (don't await)
  ;(async () => {
    try {
      const contentType = req.headers.get('content-type')
      let data

      // Handle both JSON and Blob formats (sendBeacon sends as Blob)
      if (contentType?.includes('application/json')) {
        data = await req.json()
      } else {
        const text = await req.text()
        data = JSON.parse(text)
      }

      const { pid, sid, events } = data

      if (pid && sid && events && Array.isArray(events)) {
        const supabase = createServerSupabaseClient()
        
        // Batch insert all events
        const records = events.map((e: any) => ({
          project_id: pid,
          session_id: sid,
          event_type: e.evt,
          field_name: e.fld || null,
          duration: e.dur ? Number(e.dur) : null,
          timestamp: new Date(e.t || Date.now()).toISOString(),
        }))

        // Fire and forget - don't block on DB
        supabase
          .from('form_events')
          .insert(records)
          .then(() => {})
      }
    } catch (error) {
      console.error('Analytics error:', error)
    }
  })()

  return immediateResponse
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}