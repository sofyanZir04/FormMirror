// app/pixel.gif/route.ts
// app/pixel.gif/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export const runtime = 'edge'

// 1x1 transparent GIF
const GIF = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')

export async function GET(request: NextRequest) {
  return handlePixel(request)
}

export async function POST(request: NextRequest) {
  return handlePixel(request)
}

async function handlePixel(request: NextRequest) {
  const data: Record<string, string> = {}

  try {
    // 1. Query params (GET or fallback)
    request.nextUrl.searchParams.forEach((value, key) => {
      data[key] = value
    })

    // 2. POST body (sendBeacon sends form-urlencoded)
    if (request.method === 'POST') {
      const contentType = request.headers.get('content-type') || ''
      if (contentType.includes('application/x-www-form-urlencoded')) {
        const text = await request.text()
        new URLSearchParams(text).forEach((value, key) => {
          data[key] = value
        })
      }
    }

    const { pid, sid, t, f, d, p } = data

    console.log('[Pixel] Event received:', {
      project_id: pid,
      session_id: sid,
      event_type: t,
      field_name: f,
      duration: d,
      path: p,
    })

    if (pid && sid && t) {
      const supabase = createServerSupabaseClient()

      const { error } = await supabase.from('form_events').insert({
        project_id: pid,
        session_id: sid,
        event_type: t,
        field_name: f || null,
        duration: d && d !== '' ? Number(d) : null,
        // path: p || null,
        // THIS IS THE FIX: Use the correct column name
        timestamp: new Date().toISOString(), // ← your table expects "timestamp"
        // OR if your column is "created_at":
        // created_at: new Date().toISOString(),
      })

      if (error) {
        console.error('[Pixel] Insert failed:', error)
      } else {
        console.log('[Pixel] Saved:', t, f || '')
      }
    }

    return new NextResponse(GIF, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (err) {
    console.error('[Pixel] Error:', err)
    return new NextResponse(GIF, {
      status: 200,
      headers: { 'Content-Type': 'image/gif' },
    })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

