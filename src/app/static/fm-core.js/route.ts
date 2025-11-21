// app/static/fm-core.js/route.ts
// OR app/cdn/v1/analytics.min.js/route.ts
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  // Read your actual tracking script
  const scriptPath = path.join(process.cwd(), 'public', 'tracking-script.js')
  const script = fs.readFileSync(scriptPath, 'utf-8')
  
  return new NextResponse(script, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}