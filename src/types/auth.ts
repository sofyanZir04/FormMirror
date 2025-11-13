// types/auth.ts

import type { User as SupabaseAuthUser } from '@supabase/supabase-js'
/**
 * AppUser refines user_metadata to hint that `full_name` may be present.
 * Note: user_metadata is always an object in Supabase, never undefined.
 */
export type AppUser = Omit<SupabaseAuthUser, 'user_metadata'> & {
  user_metadata: {
    full_name?: string
    [key: string]: unknown
  }
}
/**
 * Optional: if you fetch extended profile data from your 'profiles' table
 */
export interface Profile {
  id: string
  full_name?: string
  plan: 'free' | 'pro'
  last_login?: string
  updated_at?: string
  created_at?: string  
  provider?: string  
  // Add other profile fields as needed
}




// export interface AppUser extends User {  
//   user_metadata?: {
//       full_name?: string
//       [key: string]: unknown
//     }
// }

// export interface User {
//     id: string
//     email: string
//     plan: 'free' | 'pro'
//     lastLogin?: string
//     full_name?: string
//     /** Added for Settings page */
//     created_at?: string          // ISO string from Supabase `created_at`
//     provider?: string           // e.g. "google" or "email"
// }

