// hooks/useOnboarding.ts
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/browser'

export function useOnboarding() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkOnboarding = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setHasSeenOnboarding(true) // Not logged in → skip
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('has_seen_onboarding')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Onboarding check failed:', error)
      }

      const seen = data?.has_seen_onboarding ?? false
      setHasSeenOnboarding(seen)
      setLoading(false)
    }

    checkOnboarding()
  }, [])

  const markAsSeen = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('profiles')
      .update({ has_seen_onboarding: true })
      .eq('id', user.id)

    setHasSeenOnboarding(true)
  }

  return { hasSeenOnboarding, loading, markAsSeen }
}