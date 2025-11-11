export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          user_id: string
          created_at: string
          updated_at: string
          form_selector: string | null
          website_url: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
          form_selector?: string | null
          website_url?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
          form_selector?: string | null
          website_url?: string | null
        }
      }
      form_events: {
        Row: {
          id: string
          project_id: string
          field_name: string
          event_type: 'focus' | 'blur' | 'input' | 'submit' | 'abandon'
          timestamp: string
          duration: number | null
          session_id: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          field_name: string
          event_type: 'focus' | 'blur' | 'input' | 'submit' | 'abandon'
          timestamp: string
          duration?: number | null
          session_id: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          field_name?: string
          event_type?: 'focus' | 'blur' | 'input' | 'submit' | 'abandon'
          timestamp?: string
          duration?: number | null
          session_id: string
          created_at?: string
        }
      }
      user_plans: {
        Row: {
          id: string
          user_id: string
          plan_type: 'free' | 'pro'
          subscription_id: string | null
          plan_expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_type?: 'free' | 'pro'
          subscription_id?: string | null
          plan_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_type?: 'free' | 'pro'
          subscription_id?: string | null
          plan_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      get_user_plan: {
        Args: {
          user_email: string
        }
        Returns: string
      }
      is_user_pro: {
        Args: {
          user_email: string
        }
        Returns: boolean
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type FormEvent = Database['public']['Tables']['form_events']['Row']
export type UserPlan = Database['public']['Tables']['user_plans']['Row'] 