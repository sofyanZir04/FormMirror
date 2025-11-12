// types/auth.ts
import { User } from '@supabase/supabase-js'

export interface AppUser extends User {
  user_metadata?: {
    full_name?: string
    [key: string]: any
  }
}