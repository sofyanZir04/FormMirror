import { supabase } from './supabase/browser'

export interface UserPlan {
  id: string
  user_id: string
  plan_type: 'free' | 'pro'
  subscription_id: string | null
  plan_expires_at: string | null
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  created_at: string
  updated_at: string
}

/**
 * Creates or updates user plan record
 */
export async function ensureUserPlan(userId: string, planType: 'free' | 'pro' = 'free'): Promise<UserPlan | null> {
  try {
    // Validate that userId is a valid UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(userId)) {
      throw new Error('Invalid userId format. Expected UUID.')
    }

    // Check if user plan already exists
    const { data: existingPlan, error: checkError } = await supabase
      .from('user_plans')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      throw new Error(`Failed to check existing user plan: ${checkError.message}`)
    }

    if (existingPlan) {
      return existingPlan
    }

    // Create new user plan
    const { data: newPlan, error } = await supabase
      .from('user_plans')
      .insert({
        user_id: userId,
        plan_type: planType,
        status: 'active',
        start_date: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create user plan: ${error.message}`)
    }

    if (!newPlan) {
      throw new Error('Failed to create user plan: No data returned.')
    }

    return newPlan
  } catch (error) {
    console.error('🚨 Error ensuring user plan:', error)
    return null
  }
}

/**
 * Creates or updates user profile record
 */
export async function ensureUserProfile(userId: string, email: string, fullName?: string): Promise<Profile | null> {
  try {
    console.log('🔍 Creating/updating user profile for:', userId)
    console.log('🔍 Email:', email)
    console.log('🔍 Full name:', fullName)
    console.log('🔍 Supabase client available:', !!supabase)
    
    // Validate that userId is a valid UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(userId)) {
      console.error('❌ Invalid UUID format for userId:', userId)
      console.error('❌ Expected UUID format, got:', typeof userId, userId)
      return null
    }

    console.log('✅ UUID validation passed for:', userId)

    // Check if profile already exists
    console.log('🔍 Checking if user profile exists...')
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" which is expected
      console.error('❌ Error checking existing profile:', checkError)
      return null
    }

    if (existingProfile) {
      console.log('✅ User profile already exists:', existingProfile.id)
      return existingProfile
    }

    console.log('🔍 Creating new user profile...')
    // Create new profile
    const { data: newProfile, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email,
        full_name: fullName || 'User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Failed to create user profile:', error)
      console.error('❌ Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      return null
    }

    if (!newProfile) {
      console.error('❌ No data returned after profile insert')
      return null
    }

    console.log('✅ Created new user profile:', newProfile.id)
    return newProfile
  } catch (error) {
    console.error('🚨 Error ensuring user profile:', error)
    console.error('🚨 Error type:', typeof error)
    console.error('🚨 Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return null
  }
}

/**
 * Gets user plan by user ID
 */
export async function getUserPlan(userId: string): Promise<UserPlan | null> {
  try {
    console.log('🔍 Getting user plan for userId:', userId)
    console.log('🔍 Supabase client available:', !!supabase)
    
    const { data, error } = await supabase
      .from('user_plans')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle() // Use maybeSingle to avoid errors when no data exists
    

    if (error) {
      console.error('❌ Failed to get user plan:', error)
      console.error('❌ Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      return null
    }

    console.log('✅ Retrieved user plan from database:', data)
    console.log('✅ Plan type:', data?.plan_type)
    console.log('✅ Plan ID:', data?.id)
    console.log('✅ User ID:', data?.user_id)
    
    // Validate the data structure
    if (!data || !data.id || !data.user_id || !data.plan_type) {
      console.error('❌ Invalid plan data structure:', data)
      return null
    }
    
    return data
  } catch (error) {
    console.error('🚨 Error getting user plan:', error)
    console.error('🚨 Error type:', typeof error)
    console.error('🚨 Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return null
  }
}

/**
 * Gets user profile by user ID
 */
export async function getUserProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('❌ Failed to get user profile:', error)
    return null
  }
  
    return data
  } catch (error) {
    console.error('🚨 Error getting user profile:', error)
    return null
  }
}

/**
 * Handle email confirmation
 */
export const handleEmailConfirmation = async (token: string, type: string) => {
  try {
    console.log('🔐 Handling email confirmation:', { token, type })
    
    if (type === 'signup') {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup'
      })
      
      if (error) {
        console.error('❌ Email confirmation failed:', error)
        throw error
      }
      
      console.log('✅ Email confirmed successfully:', data.user?.email)
      return { success: true, user: data.user }
    }
    
    return { success: false, error: 'Invalid confirmation type' }
  } catch (error) {
    console.error('🚨 Email confirmation error:', error)
    return { success: false, error }
  }
}

/**
 * Check if user email is confirmed
 */
export const isEmailConfirmed = async (email: string) => {
  try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.error('❌ Error checking email confirmation:', error)
      return false
    }
    
    const user = users.find(u => u.email === email)
    return user?.email_confirmed_at !== null
  } catch (error) {
    console.error('🚨 Error checking email confirmation:', error)
    return false
  }
}

/**
 * Test function to debug user plan creation
 */
export const testUserPlanCreation = async (testUserId: string) => {
  try {
    console.log('🧪 Testing user plan creation...')
    console.log('🧪 Test user ID:', testUserId)
    console.log('🧪 Test user ID type:', typeof testUserId)
    console.log('🧪 Supabase client:', !!supabase)
    
    // Test basic database connection
    console.log('🧪 Testing database connection...')
    const { error: testError } = await supabase
      .from('user_plans')
      .select('*')
      .limit(1)
    
    // This is a test function and should not be used in production
    // const { data: testData, error: testError } = await supabase
    //   .from('user_plans')
    //   .select('*')
    //   .limit(1)

    // if (testError) {
    //   console.error('Test error:', testError)
    // }

    // console.log('Test data:', testData)
    
    if (testError) {
      console.error('🧪 Database connection test failed:', testError)
      return { success: false, error: testError, step: 'connection_test' }
    }
    
    console.log('🧪 Database connection test passed')
    
    // Test the exact operation that's failing
    const result = await ensureUserPlan(testUserId, 'free')
    console.log('🧪 Test result:', result)
    
    return { success: !!result, result, step: 'plan_creation' }
  } catch (error) {
    console.error('🧪 Test failed:', error)
    return { success: false, error, step: 'exception' }
  }
}

/**
 * Test database table structure and permissions
 */
export const testDatabaseAccess = async () => {
  try {
    console.log('🧪 Testing database access...')
    
    // Test SELECT permission
    const { data: selectData, error: selectError } = await supabase
      .from('user_plans')
      .select('*')
      .limit(1)
    
    console.log('🧪 SELECT test result:', { data: selectData, error: selectError })
    
    // Test INSERT permission (with a dummy record that will be rolled back)
    const { data: insertData, error: insertError } = await supabase
      .from('user_plans')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
        plan_type: 'free',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
    
    console.log('🧪 INSERT test result:', { data: insertData, error: insertError })
    
    return {
      select: { success: !selectError, error: selectError },
      insert: { success: !insertError, error: insertError }
    }
  } catch (error) {
    console.error('🧪 Database access test failed:', error)
    return { error, step: 'exception' }
  }
}