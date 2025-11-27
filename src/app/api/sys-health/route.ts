import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 1. Initialize Supabase directly here to ensure it works in Edge
// (Ensure you have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    // 2. Parse the body
    // We expect text/plain (base64) to bypass blockers
    let bodyData;
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('text/plain')) {
      const text = await req.text();
      if (!text) return new Response(null, { status: 200 }); // Empty request
      
      const decoded = atob(text);
      bodyData = JSON.parse(decoded);
    } else {
      bodyData = await req.json();
    }

    const { p, s, d } = bodyData || {};

    // 3. Insert into Supabase
    // CRITICAL: We MUST await this. 
    if (p && s && d && Array.isArray(d)) {
      const records = d.map((e: any) => ({
        project_id: p,
        session_id: s,
        event_type: e.evt,
        field_name: e.fld || null,
        duration: e.dur ? Number(e.dur) : null,
        timestamp: new Date(e.t || Date.now()).toISOString(),
      }));

      const { error } = await supabase
        .from('form_events')
        .insert(records);

      if (error) {
        console.error('Supabase Error:', error);
      }
    }

    // 4. Return Success
    return new NextResponse('ok', {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    });

  } catch (error) {
    // Even if it fails, return 200 to the client so the browser doesn't retry
    console.error('Script Error:', error);
    return new NextResponse('ok', { status: 200 });
  }
}

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

