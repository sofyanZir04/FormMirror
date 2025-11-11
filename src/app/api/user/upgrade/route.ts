import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { userId, plan } = await req.json()
    
    if (!userId || !plan) {
      return NextResponse.json({ error: 'User ID and plan are required' }, { status: 400 })
    }

    if (plan !== 'free' && plan !== 'pro') {
      return NextResponse.json({ error: 'Plan must be either "free" or "pro"' }, { status: 400 })
    }

    // Update user plan in Supabase
    const { error } = await supabase
      .from('user_plans')
      .update({ 
        plan_type: plan,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)

    if (error) {
      console.error('Failed to update user plan:', error)
      return NextResponse.json({ error: 'Failed to update user plan' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: `User upgraded to ${plan} plan successfully` 
    })
  } catch (error) {
    console.error('Upgrade user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 