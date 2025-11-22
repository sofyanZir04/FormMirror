// app/api/form-entry/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    // Get the origin for proper CORS handling
    const origin = req.headers.get('origin') || ''
    
    const body = await req.json()
    
    // Validate the request body - expecting minimal data like { formId: "123" }
    if (!body.formId) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing formId' }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          }
        }
      )
    }

    // Perform the actual write operation to Supabase (server-side)
    const supabase = createServerSupabaseClient()
    
    // Insert form entry data into Supabase
    const { error } = await supabase
      .from('form_entries') // Assuming a form_entries table exists
      .insert({
        form_id: body.formId,
        submitted_data: body.data || null, // Additional form data if provided
        user_agent: req.headers.get('user-agent') || null,
        ip_address: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null,
        timestamp: new Date().toISOString(),
      })

    if (error) {
      console.error('Supabase insert error:', error)
      return new NextResponse(
        JSON.stringify({ error: 'Failed to save form entry' }), 
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          }
        }
      )
    }

    // Return successful response with proper CORS headers
    return new NextResponse(
      JSON.stringify({ success: true, message: 'Form entry saved successfully' }), 
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        }
      }
    )
  } catch (error) {
    console.error('Form entry API error:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Invalid request' }), 
      { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': req.headers.get('origin') || '',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        }
      }
    )
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin') || ''
  
  return new NextResponse(null, {
    status: 204, // 204 No Content is the standard response for OPTIONS
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    },
  })
}