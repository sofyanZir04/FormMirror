// app/api/v1/route.ts - Ad-blocker resistant analytics endpoint
import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  // Respond immediately with 200 OK to avoid detection
  const immediateResponse = new Response(null, {
    status: 200,
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

      // Handle both base64 encoded text/plain and regular formats
      if (contentType?.includes('text/plain')) {
        const encodedText = await req.text()
        const decodedText = atob(encodedText) // Decode base64
        data = JSON.parse(decodedText)
      } else if (contentType?.includes('application/json')) {
        data = await req.json()
      } else {
        const text = await req.text()
        data = JSON.parse(text)
      }

      const { p, s, d } = data // projectId, sessionId, data (events)

      if (p && s && d && Array.isArray(d)) {
        const supabase = createServerSupabaseClient()
        
        // Batch insert all events
        const records = d.map((e: any) => ({
          project_id: p,
          session_id: s,
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
      // Silent error handling - no logging to avoid detection
    }
  })()

  return immediateResponse
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}