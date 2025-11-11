import { createBrowserClient } from '@supabase/ssr'
// import { Database } from '@/types/database.types'
import { Database } from '@/types/supabase'
// import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

// export const supabase = createBrowserSupabaseClient<Database>(
export const supabase = createPagesBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  }
  )
// export const supabase = createBrowserSupabaseClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//   {
//     auth: {
//       autoRefreshToken: true,
//       persistSession: true,
//       detectSessionInUrl: true,
//       flowType: 'pkce'
//     }
//   }
// ) 

// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// export const supabase = createClient(supabaseUrl, supabaseAnonKey) 