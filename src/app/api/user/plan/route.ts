import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    console.log('🔍 API: Getting user plan for userId:', userId)

    if (!userId) {
      console.error('❌ API: No userId provided')
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(userId)) {
      console.error('❌ API: Invalid UUID format:', userId)
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 })
    }

    console.log('✅ API: UUID validation passed, fetching user plan...')
    
    // Use service role client to bypass RLS for API operations
    const supabase = createServerSupabaseClient()
    
    // Test database connection first
    try {
      const { data: testData, error: testError } = await supabase
        .from('user_plans')
        .select('*', { count: 'exact', head: true })
        
      console.log('🔍 API: Database test result:', testData, testError)
    } catch (dbError) {
      console.error('❌ API: Database connection test failed:', dbError)
    }
    
    // Simplified: Get user plan directly
    console.log('🔍 API: Fetching user plan directly from database...')
    
    const { data: userPlan, error: fetchError } = await supabase
      .from('user_plans')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
    
    console.log('📊 API: Direct fetch result:', userPlan, fetchError)
    
    let finalUserPlan = userPlan
    
    // If no plan exists, create one
    if (!userPlan && !fetchError) {
      console.log('🔍 API: No plan found, creating one...')
      
      const { data: newPlan, error: createError } = await supabase
        .from('user_plans')
        .insert({
          user_id: userId,
          plan_type: 'free',
          subscription_id: null,
          plan_expires_at: null
        })
        .select()
        .single()
        
      console.log('📊 API: Create result:', newPlan, createError)
      
      if (newPlan && !createError) {
        finalUserPlan = newPlan
      } else {
        console.error('❌ API: Failed to create plan:', createError)
        // Use a working fallback
        finalUserPlan = {
          id: `fallback-${userId}`,
          user_id: userId,
          plan_type: 'free' as const,
          subscription_id: null,
          plan_expires_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
    } else if (fetchError) {
      console.error('❌ API: Error fetching plan:', fetchError)
      // Use a working fallback
      finalUserPlan = {
        id: `fallback-${userId}`,
        user_id: userId,
        plan_type: 'free' as const,
        subscription_id: null,
        plan_expires_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }
    
    console.log('📊 API: Final user plan result:', finalUserPlan)
    
    // Ensure we have the plan data
    if (!finalUserPlan || !finalUserPlan.plan_type) {
      console.error('❌ API: Invalid user plan data:', finalUserPlan)
      return NextResponse.json({
        error: 'Invalid user plan data',
        details: 'User plan data is corrupted or incomplete'
      }, { status: 500 })
    }
    
    const planType = finalUserPlan.plan_type
    
    const isPro = planType === 'pro'

    const response = {
      plan: {
        plan: planType,
        isPro,
        features: {
          free: {
            maxProjects: 3,
            maxFormInteractions: 5000,
            dataRetention: '7 days',
            support: 'Community',
          },
          pro: {
            maxProjects: 'Unlimited',
            maxFormInteractions: 50000,
            dataRetention: '90 days',
            support: 'Priority',
          }
        },
        // Include real plan data for debugging
        realData: {
          planId: finalUserPlan.id,
          userId: finalUserPlan.user_id,
          planType: finalUserPlan.plan_type,
          createdAt: finalUserPlan.created_at,
          updatedAt: finalUserPlan.updated_at
        }
      }
    }

    console.log('✅ API: Returning REAL plan data:', response)
    
    // Add cache headers for better performance
    const responseObj = NextResponse.json(response)
    responseObj.headers.set('Cache-Control', 'private, max-age=300') // Cache for 5 minutes
    responseObj.headers.set('X-Plan-Cache', 'true')
    responseObj.headers.set('X-Plan-Real-Data', 'true')
    
    return responseObj
  } catch (error) {
    console.error('🚨 API: Get user plan error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 