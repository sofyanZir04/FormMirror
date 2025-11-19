// app/api/track/route.ts   ← THIS IS THE FINAL WORKING VERSION

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

// THIS IS THE MAGIC LINE THAT BYPASSES VERCEL'S BLOCK
export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { project_id, event_type, field_name, duration, session_id } = body

    if (!project_id || !event_type || !session_id) {
      return new NextResponse('Bad request', { status: 400 })
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

    // MUST return these headers
    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (err) {
    return new NextResponse('Error', { status: 500 })
  }
}

// This handles preflight and fixes the block
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
// formmirror/src/app/api/track/route.ts
// import { NextRequest, NextResponse } from 'next/server'
// import { createServerSupabaseClient } from '@/lib/supabase'

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()

//     // THIS IS THE KEY FIX FOR VERCEL
//     // Vercel blocks dynamic origins by default → we allow ALL origins explicitly
//     const responseHeaders = {
//       'Access-Control-Allow-Origin': '*',           // ← Allow everyone (safe for analytics)
//       'Access-Control-Allow-Methods': 'POST, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type',
//     }

//     if (request.method === 'OPTIONS') {
//       return new NextResponse(null, { status: 200, headers: responseHeaders })
//     }

//     const { project_id, event_type, field_name, duration, session_id } = body

//     if (!project_id || !event_type || !session_id) {
//       return NextResponse.json(
//         { error: 'Missing required fields' },
//         { status: 400, headers: responseHeaders }
//       )
//     }

//     const supabase = createServerSupabaseClient()
//     const { error } = await supabase.from('form_events').insert({
//       project_id,
//       event_type,
//       field_name: field_name || null,
//       duration: duration || null,
//       session_id,
//       timestamp: new Date().toISOString(),
//     })

//     if (error) {
//       console.error('Supabase insert error:', error)
//       return NextResponse.json(
//         { error: 'Failed to save' },
//         { status: 500, headers: responseHeaders }
//       )
//     }

//     return NextResponse.json({ success: true }, { headers: responseHeaders })

//   } catch (err) {
//     console.error('Track API error:', err)
//     return NextResponse.json(
//       { error: 'Bad request' },
//       { 
//         status: 400,
//         headers: { 'Access-Control-Allow-Origin': '*' }
//       }
//     )
//   }
// }

// // Required for preflight
// export const OPTIONS = async () => {
//   return new NextResponse(null, {
//     status: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'POST, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type',
//     },
//   })
// }

// import { NextRequest, NextResponse } from 'next/server'
// import { createServerSupabaseClient } from '@/lib/supabase'

// export async function POST(request: NextRequest) {
//   const origin = request.headers.get('origin')
//   console.log('📥 Incoming /api/track request:', request.method, origin, request.headers.get('referer'))

//   // CORS headers
//   const headers = {
//       'Access-Control-Allow-Origin': origin || '*',
//       'Access-Control-Allow-Methods': 'POST, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type',
//   }

//   // Handle preflight requests
//   if (request.method === 'OPTIONS') {
//     return new NextResponse(null, { status: 200, headers })
//   }

//   try {
//     const body = await request.json()
//     console.log('📊 Received tracking data:', body)

//     const { project_id, event_type, field_name, duration, session_id } = body

//     if (!project_id || !event_type || !session_id) {
//       console.log('❌ Missing required fields')
//       return NextResponse.json(
//         { error: 'Missing required fields' },
//         { status: 400, headers }
//       )
//     }

//     // Insert event into database using service role client
//     const supabase = createServerSupabaseClient()
//     const { error } = await supabase
//       .from('form_events')
//       .insert({
//         project_id,
//         event_type,
//         field_name: field_name || '',
//         duration: duration || null,
//         session_id,
//         timestamp: new Date().toISOString(),
//       })

//     if (error) {
//       console.error('❌ Database error:', error)
//       return NextResponse.json(
//         { error: 'Failed to save event' },
//         { status: 500, headers }
//       )
//     }

//     console.log('✅ Event saved successfully')
//     return NextResponse.json({ success: true }, { headers })

//   } catch (error) {
//     console.error('❌ Error processing request:', error)
//     return NextResponse.json(
//       { error: 'Invalid request' },
//       { status: 400, headers }
//     )
//   }
// } 