// app/api/content/update/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return handleOptions(req);
  }

  // Set CORS headers
  const origin = req.headers.get('origin');
  const headers = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Timing-Allow-Origin': origin || '*',
  };

  // Respond immediately to prevent binding abort
  const immediateResponse = new NextResponse(null, {
    status: 204,
    headers: headers,
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
      console.error('Content update error:', error)
    }
  })()

  return immediateResponse
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}

function handleOptions(req: NextRequest) {
  const origin = req.headers.get('origin');
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    },
  });
}