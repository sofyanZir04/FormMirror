// app/pixel.gif/route.ts   ← FINAL VERSION THAT WORKS EVERY TIME

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export const runtime = 'edge' // optional, fastest

// Accept BOTH GET (for <img>) and POST (for sendBeacon with body)
export async function GET(request: NextRequest) {
  return handlePixel(request)
}

export async function POST(request: NextRequest) {
  return handlePixel(request)
}

// Shared logic
async function handlePixel(request: NextRequest) {
  try {
    // For GET: query params
    // For POST: try JSON body first, fallback to query params
    let data: any = Object.fromEntries(request.nextUrl.searchParams)

    if (request.method === 'POST') {
      try {        
        const json = await request.json()
        data = { ...data, ...json }
      } catch {
        // ignore invalid JSON
      }
    }

    const { pid, sid, t, f, d, p } = data
    // Add this at the top of handlePixel function
    console.log('PIXEL HIT!', {
        pid,sid,t,f,d,
        path: p,time: new Date().toISOString()
    })

    if (pid && sid && t) {
      const supabase = createServerSupabaseClient()
      await supabase.from('form_events').insert({
        project_id: pid,
        session_id: sid,
        event_type: t,
        field_name: f || null,
        duration: d ? Number(d) : null,
        path: p || null,
        timestamp: new Date().toISOString(),
      })
    }

    // 1x1 GIF pixel
    const GIF = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')

    return new NextResponse(GIF, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    return new NextResponse(null, { status: 204 })
  }
}