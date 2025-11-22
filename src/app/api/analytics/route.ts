// app/api/analytics/route.ts - Alias for backward compatibility
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  // Forward to the new endpoint to avoid ad blockers
  const url = new URL('/api/feedback', req.url.replace(req.nextUrl.pathname, ''));
  const headers = new Headers(req.headers);
  headers.set('Content-Type', 'application/json');

  const body = await req.text();

  try {
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: headers,
      body: body,
    });

    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Analytics alias error:', error);
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}