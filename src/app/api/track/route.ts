// formmirror/src/app/api/track/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')
  console.log('📥 Incoming /api/track request:', request.method, origin, request.headers.get('referer'))

  // CORS headers
  const headers = {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
  }

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers })
  }

  try {
    const body = await request.json()
    console.log('📊 Received tracking data:', body)

    const { project_id, event_type, field_name, duration, session_id } = body

    if (!project_id || !event_type || !session_id) {
      console.log('❌ Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400, headers }
      )
    }

    // Insert event into database using service role client
    const supabase = createServerSupabaseClient()
    const { error } = await supabase
      .from('form_events')
      .insert({
        project_id,
        event_type,
        field_name: field_name || '',
        duration: duration || null,
        session_id,
        timestamp: new Date().toISOString(),
      })

    if (error) {
      console.error('❌ Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save event' },
        { status: 500, headers }
      )
    }

    console.log('✅ Event saved successfully')
    return NextResponse.json({ success: true }, { headers })

  } catch (error) {
    console.error('❌ Error processing request:', error)
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400, headers }
    )
  }
} 