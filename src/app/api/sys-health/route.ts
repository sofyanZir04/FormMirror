// app/api/sys-health/route.ts - Camouflaged analytics endpoint
import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export const runtime = 'edge'

interface EventData {
  evt: string;
  fld?: string;
  dur?: number;
  t: number;
}

export async function POST(req: NextRequest) {
  // Respond immediately to prevent binding abort
  const immediateResponse = new Response(null, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })

  // Process data asynchronously (don't await)
  ;(async () => {
    try {
      const contentType = req.headers.get('content-type')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let data: any = null

      // Handle base64 encoded text/plain
      if (contentType?.includes('text/plain')) {
        const encodedText = await req.text()
        const decodedText = atob(encodedText)
        data = JSON.parse(decodedText)
      } else {
        // Fallback for other content types
        data = await req.json()
      }

      const { p, s, d } = data || {}

      if (p && s && d && Array.isArray(d)) {
        const supabase = createServerSupabaseClient()

        // Batch insert all events
        const records = d.map((e: EventData) => ({
          project_id: p,
          session_id: s,
          event_type: e.evt,
          field_name: e.fld || null,
          duration: e.dur ? Number(e.dur) : null,
          timestamp: new Date(e.t || Date.now()).toISOString(),
        }))

        // Fire and forget - don't block on DB
        void supabase
          .from('form_events')
          .insert(records)
      }
    } catch {
      // Silent error handling - no logging
    }
  })()

  return immediateResponse
}

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
