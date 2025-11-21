// app/api/analytics/route.ts
import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
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

    const { pid, sid, evt, fld, dur } = data

    if (pid && sid && evt) {
      const supabase = createServerSupabaseClient()
      
      // Use upsert to handle potential duplicates gracefully
      await supabase
        .from('form_events')
        .insert({
          project_id: pid,
          session_id: sid,
          event_type: evt,
          field_name: fld || null,
          duration: dur ? Number(dur) : null,
          timestamp: new Date().toISOString(),
        })
        .select()
    }
  } catch (error) {
    // Log errors server-side but don't expose them
    console.error('Analytics error:', error)
  }

  // Return minimal 204 No Content (faster, less data)
  return new Response(null, {
    status: 204,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
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