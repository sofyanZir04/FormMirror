import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function withCORS(json: any, status = 200, origin?: string | null) {
  return new NextResponse(JSON.stringify(json), {
    status,
    headers: {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
      'Content-Type': 'application/json',
    },
  })
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  console.log('📥 Incoming /api/track request:', request.method, origin, request.headers.get('referer'));
  try {
    const body = await request.json()
    const { project_id, field_name, event_type, timestamp, duration, session_id } = body

    console.log('=== TRACKING EVENT RECEIVED ===')
    console.log('Project ID:', project_id)
    console.log('Field Name:', field_name)
    console.log('Event Type:', event_type)
    console.log('Timestamp:', timestamp)
    console.log('Duration:', duration)
    console.log('Session ID:', session_id)
    console.log('==============================')

    // Validate required fields
    if (!project_id || !field_name || !event_type || !timestamp || !session_id) {
      console.error('❌ Missing required fields:', { project_id, field_name, event_type, timestamp, session_id })
      return withCORS(
        { error: 'Missing required fields', received: { project_id, field_name, event_type, timestamp, session_id } },
        400,
        origin
      )
    }

    // Validate event type
    const validEventTypes = ['focus', 'blur', 'input', 'submit', 'abandon']
    if (!validEventTypes.includes(event_type)) {
      console.error('❌ Invalid event type:', event_type)
      return withCORS(
        { error: 'Invalid event type', received: event_type, valid: validEventTypes },
        400,
        origin
      )
    }

    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    console.log('Environment check:')
    console.log('- SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
    console.log('- SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing')

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing Supabase environment variables')
      return withCORS(
        { 
          error: 'Server configuration error', 
          details: 'Missing Supabase environment variables',
          required: ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'],
          present: {
            url: !!supabaseUrl,
            serviceKey: !!supabaseServiceKey
          }
        },
        500,
        origin
      )
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    console.log('✅ Supabase client created successfully')

    // Insert the event
    const eventData = {
      project_id,
      field_name,
      event_type,
      timestamp: new Date(timestamp).toISOString(),
      duration: duration || null,
      session_id,
    }

    console.log('📝 Inserting event data:', eventData)

    const { data, error } = await supabase
      .from('form_events')
      .insert(eventData)
      .select()

    if (error) {
      console.error('❌ Error inserting event:', error)
      return withCORS(
        { 
          error: 'Failed to save event', 
          details: error.message,
          code: error.code,
          hint: error.hint
        },
        500,
        origin
      )
    }

    console.log('✅ Successfully saved event:', data)
    return withCORS({ 
      success: true, 
      data,
      message: 'Event tracked successfully'
    }, 200, origin)
  } catch (error) {
    console.error('❌ Error processing tracking request:', error)
    return withCORS(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      500,
      origin
    )
  }
}

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    },
  })
} 