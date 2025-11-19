// app/t/route.ts
// This endpoint receives tracking data from any website (third-party)
// Vercel allows it because it's NOT under /api/*

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

// Optional: make it Edge for faster global response (works perfectly)
export const runtime = 'edge' // or remove this line if you prefer Node.js runtime

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      project_id,
      event_type,
      field_name,
      duration,
      session_id,
      path,
      referrer,
      ua,
    } = body

    // Basic validation
    if (!project_id || !event_type || !session_id) {
      return new NextResponse('Bad request', { status: 400 })
    }

    // Save to Supabase
    const supabase = createServerSupabaseClient()
    const { error } = await supabase.from('form_events').insert({
      project_id,
      event_type,
      field_name: field_name ?? null,
      duration: duration ?? null,
      session_id,
      path: path ?? null,
      referrer: referrer ?? null,
      ua: ua ?? null,
      timestamp: new Date().toISOString(),
    })

    if (error) {
      console.error('Supabase error:', error)
      return new NextResponse('DB error', { status: 500 })
    }

    // Return 1x1 transparent GIF (classic analytics pixel)
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    )

    return new NextResponse(pixel, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, no-store, must-revalidate',
        'Expires': '0',
      },
    })
  } catch (err) {
    console.error('Tracking endpoint error:', err)
    return new NextResponse(null, { status: 204 })
  }
}

// Handle preflight CORS requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}