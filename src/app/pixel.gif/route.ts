// app/pixel.gif/route.ts   ← THIS IS THE FINAL, UNBLOCKABLE ENDPOINT

import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export const runtime = 'edge' // optional, but fast

export async function GET(request: NextRequest) {
  // Parse query string (sendBeacon sends data as query string for GET)
  const url = new URL(request.url)
  const params = url.searchParams

  const payload = {
    project_id: params.get('pid'),
    session_id: params.get('sid'),
    event_type: params.get('t') || 'pageview',
    field_name: params.get('f') || null,
    duration: params.get('d') ? Number(params.get('d')) : null,
    path: params.get('p') || '',
  }

  if (payload.project_id && payload.session_id) {
    const supabase = createServerSupabaseClient()
    await supabase.from('form_events').insert({
      ...payload,
      timestamp: new Date().toISOString(),
    })
  }

  // 1x1 transparent GIF (the magic pixel)
  const gif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')

  return new Response(gif, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Expires': '0',
    },
  })
}