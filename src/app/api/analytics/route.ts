// app/api/analytics/route.ts - Analytics endpoint with proper CORS and cookie handling
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return handleOptions(req);
  }

  // Set CORS headers
  const origin = req.headers.get('origin');
  const headers = {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  };

  try {
    // Process analytics data
    const body = await req.json();
    
    // Your analytics processing logic here
    console.log('Analytics data received:', body);

    // Create response with proper CORS headers
    const response = new NextResponse(JSON.stringify({ success: true, message: 'Analytics received' }), {
      status: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    });

    // Set cookies with proper attributes for cross-origin requests
    // Note: In Next.js middleware/route handlers, we can't directly set cookies with attributes
    // The client-side code should handle cookie setting with proper attributes
    return response;
  } catch (error) {
    console.error('Analytics error:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to process analytics' }), {
      status: 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    });
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}

function handleOptions(req: NextRequest) {
  const origin = req.headers.get('origin');
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
export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin');
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