// app/api/track/route.ts - Analytics tracking endpoint with proper CORS handling
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    return handleOptions(request);
  }

  // Set CORS headers
  const origin = request.headers.get('origin');
  const headers = {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  };

  try {
    const body = await request.json()

    const { project_id, event_type, field_name, duration, session_id } = body

    if (!project_id || !event_type || !session_id) {
      return new NextResponse(JSON.stringify({ error: 'Bad request' }), {
        status: 400,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
      })
    }

    const supabase = createServerSupabaseClient()
    await supabase.from('form_events').insert({
      project_id,
      event_type,
      field_name: field_name || null,
      duration: duration || null,
      session_id,
      timestamp: new Date().toISOString(),
    })

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    })
  } catch (err) {
    console.error('Track API error:', err);
    return new NextResponse(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    })
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

function handleOptions(request: NextRequest) {
  const origin = request.headers.get('origin');
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

// Handle GET requests as well
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  return new NextResponse(JSON.stringify({ message: 'Analytics endpoint' }), {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Content-Type': 'application/json',
    },
  });
} 