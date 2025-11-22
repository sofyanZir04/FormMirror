// app/api/p/route.ts - Pixel endpoint for ad-blocker resistant tracking
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return handleOptions(req);
  }

  // Set CORS headers
  const origin = req.headers.get('origin');
  const headers = {
    'Content-Type': 'image/gif',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Timing-Allow-Origin': origin || '*',
  };

  // Handle GET requests (pixel tracking)
  const url = new URL(req.url)
  const projectId = url.searchParams.get('i') || url.searchParams.get('pid')
  const sessionId = url.searchParams.get('s') || url.searchParams.get('sid')
  const eventType = url.searchParams.get('e') || url.searchParams.get('t')
  const fieldName = url.searchParams.get('n') || url.searchParams.get('f')
  const duration = url.searchParams.get('d')

  if (projectId && sessionId && eventType) {
    // Process data asynchronously (don't await)
    ;(async () => {
      try {
        const supabase = createServerSupabaseClient()
        await supabase.from('form_events').insert({
          project_id: projectId,
          session_id: sessionId,
          event_type: eventType,
          field_name: fieldName || null,
          duration: duration ? Number(duration) : null,
          timestamp: new Date().toISOString(),
        })
      } catch (error) {
        console.error('Pixel tracking error:', error)
      }
    })()
  }

  // Return a 1x1 transparent GIF
  const gif = Buffer.from('R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', 'base64')
  return new NextResponse(gif, {
    status: 200,
    headers: headers,
  })
}

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
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Timing-Allow-Origin': origin || '*',
  };

  // Also handle POST requests for maximum compatibility
  const immediateResponse = new NextResponse(null, {
    status: 204,
    headers: headers,
  })

  // Process data asynchronously (don't await)
  ;(async () => {
    try {
      const contentType = req.headers.get('content-type')
      let data

      // Handle both JSON and URL-encoded formats
      if (contentType?.includes('application/json')) {
        data = await req.json()
      } else {
        const text = await req.text()
        if (contentType?.includes('application/x-www-form-urlencoded')) {
          const params = new URLSearchParams(text)
          data = Object.fromEntries(params.entries())
        } else {
          data = JSON.parse(text)
        }
      }

      // Handle different parameter formats
      const projectId = data.pid || data.i || data.project_id
      const sessionId = data.sid || data.s || data.session_id
      const eventType = data.evt || data.e || data.t || data.event_type
      const fieldName = data.fld || data.n || data.f || data.field_name
      const duration = data.dur || data.d || data.duration

      if (projectId && sessionId && eventType) {
        const supabase = createServerSupabaseClient()
        await supabase.from('form_events').insert({
          project_id: projectId,
          session_id: sessionId,
          event_type: eventType,
          field_name: fieldName || null,
          duration: duration ? Number(duration) : null,
          timestamp: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error('Pixel POST tracking error:', error)
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    },
  });
}