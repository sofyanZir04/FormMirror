// types/auth.ts
import { User } from '@supabase/supabase-js'

export interface AppUser extends User {  
  user_metadata?: {
      full_name?: string
      [key: string]: any
    }
  }

  export interface User {
    id: string
    email: string
    plan: 'free' | 'pro'
    lastLogin?: string
    full_name?: string
    /** Added for Settings page */
    createdAt?: string          // ISO string from Supabase `created_at`
    provider?: string           // e.g. "google" or "email"
  }
}
