// // app/p/route.ts
import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export const runtime = 'edge' // أسرع شيء

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const pid = searchParams.get('i')
  const sid = searchParams.get('s')
  const e = searchParams.get('e')
  const n = searchParams.get('n')
  const d = searchParams.get('d')

  if (pid && sid && e) {
    const supabase = createServerSupabaseClient()
    await supabase
      .from('form_events')
      .insert({
        project_id: pid,
        session_id: sid,
        event_type: e,
        field_name: n || null,
        duration: d ? Number(d) : null,
        timestamp: new Date().toISOString(),
      })
      .catch(() => {}) // لا نخلي أي خطأ يوقف الـ GIF
  }

  // 1×1 شفاف
  const GIF = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')

  return new Response(GIF, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, private, max-age=0',
      'Expires': '0',
    },
  })
}

// import { NextRequest, NextResponse } from 'next/server'
// import { createServerSupabaseClient } from '@/lib/supabase'

// export const runtime = 'edge'

// // 1x1 transparent GIF
// const GIF = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')

// export async function GET(request: NextRequest) {
//   return handlePixel(request)
// }

// export async function POST(request: NextRequest) {
//   return handlePixel(request)
// }

// async function handlePixel(request: NextRequest) {
//   const data: Record<string, string> = {}

//   try {
//     // 1. Query params (GET or fallback)
//     request.nextUrl.searchParams.forEach((value, key) => {
//       data[key] = value
//     })

//     // 2. POST body (sendBeacon sends form-urlencoded)
//     if (request.method === 'POST') {
//       const contentType = request.headers.get('content-type') || ''
//       if (contentType.includes('application/x-www-form-urlencoded')) {
//         const text = await request.text()
//         new URLSearchParams(text).forEach((value, key) => {
//           data[key] = value
//         })
//       }
//     }

//     const { pid, sid, t, f, d} = data

//     if (pid && sid && t) {
//       const supabase = createServerSupabaseClient()

//       const { error } = await supabase.from('form_events').insert({
//         project_id: pid,
//         session_id: sid,
//         event_type: t,
//         field_name: f || null,
//         duration: d && d !== '' ? Number(d) : null,
//         timestamp: new Date().toISOString(), // ← your table expects "timestamp"
//       })

//       if (error) {
//         console.error('[Pixel] Insert failed:', error)
//       } else {
//         console.log('[Pixel] Saved:', t, f || '')
//       }
//     }

//     return new NextResponse(GIF, {
//       status: 200,
//       headers: {
//         'Content-Type': 'image/gif',
//         'Cache-Control': 'no-store, no-cache, private',
//         'Access-Control-Allow-Origin': '*',
//       },
//     })
//   } catch (err) {
//     console.error('[Pixel] Error:', err)
//     return new NextResponse(GIF, {
//       status: 200,
//       headers: { 'Content-Type': 'image/gif' },
//     })
//   }
// }

// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 204,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type',
//     },
//   })
// }

