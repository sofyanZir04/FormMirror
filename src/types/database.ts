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
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
          form_selector?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
          form_selector?: string | null
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
          session_id?: string
          created_at?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type FormEvent = Database['public']['Tables']['form_events']['Row'] 