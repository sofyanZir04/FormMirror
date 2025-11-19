// app/t/route.ts   ← THIS IS THE FINAL WORKING ENDPOINT

import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export const POST = async () => {
  try {
    const body = await request.json()

    const { project_id, event_type, field_name, duration, session_id, path, referrer, ua } = body

    if (!project_id || !event_type || !session_id) {
      return new NextResponse('bad', { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    await supabase.from('form_events').insert({
      project_id,
      event_type,
      field_name,
      duration,
      session_id,
      path,
      referrer,
      ua,
      timestamp: new Date().toISOString(),
    })

    // 1x1 transparent pixel (classic analytics trick)
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')

    return new NextResponse(pixel, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch {
    return new NextResponse(null, { status: 204 })
  }
}

// This makes it accept POST from anywhere
export const OPTIONS = () => new NextResponse(null, { status: 204 })