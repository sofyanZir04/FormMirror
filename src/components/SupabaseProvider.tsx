'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useState } from 'react'
import { Database } from '@/types/supabase'

type Props = {
  children: React.ReactNode
}

export default function SupabaseProvider({ children }: Props) {
  const [supabase] = useState(() => 
    createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  )

  return (
    <div>
      {children}
    </div>
  )
}