import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { users } from '@/lib/users'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }
  // Check if user exists
  if (users.find(u => u.email === email)) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 })
  }
  // Hash password
  const hashed = await bcrypt.hash(password, 10)
  users.push({ email, password: hashed })
  return NextResponse.json({ success: true })
} 