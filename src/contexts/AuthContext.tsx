'use client'

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase/browser'
import { encryptData } from '@/lib/encryption'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface User {
  id: string
  email: string
  plan: 'free' | 'pro'
  lastLogin?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const transformUser = useCallback((supabaseUser: SupabaseUser): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email!,
      plan: 'free',
      lastLogin: new Date().toISOString()
    }
  }, [])

  // Helper: Get session with timeout
  const getSessionWithTimeout = async (timeoutMs = 3000) => {
    const sessionPromise = supabase.auth.getSession()

    const timeoutPromise = new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), timeoutMs)
    })

    const result = await Promise.race([sessionPromise, timeoutPromise])

    // If timeout wins → return null (treat as no session)
    if (result === null) {
      console.warn('Session check timed out after 3s')
      return { data: { session: null }, error: null }
    }

    return result as { data: { session: any }, error: any }
  }

  useEffect(() => {
    let mounted = true
    let subscription: { unsubscribe: () => void } | null = null

    const initAuth = async () => {
      try {
        const { data: { session }, error } = await getSessionWithTimeout()

        if (!mounted) return

        if (error) {
          console.error('Error getting session:', error)
          setUser(null)
        } else if (session?.user) {
          // console.log('User authenticated:', session.user.email)
          setUser(transformUser(session.user))
        } else {
          // console.log('No active session')
          setUser(null)
        }
      } catch (err) {
        console.error('Session init failed:', err)
        if (mounted) setUser(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    initAuth()

    // Listen for auth changes
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return

      console.log('Auth event:', event)

      if (session?.user) {
        setUser(transformUser(session.user))
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    subscription = data.subscription

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [transformUser])

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      })

      if (error) throw error

      toast.success('Logged in successfully!')
      // onAuthStateChange will update user
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error.message || 'Login failed')
      throw error
    }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/dashboard` }
      })

      if (error) throw error
    } catch (error: any) {
      toast.error(error.message || 'Google sign-in failed')
      throw error
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      setUser(null)
      setLoading(false)
      toast.success('Logged out')
      router.push('/auth/login')

      // Non-blocking logout
      supabase.auth.signOut().catch(console.error)
    } catch (error: any) {
      console.error('Logout error:', error)
      toast.error('Logout failed')
    }
  }, [router])

  const contextValue = useMemo(
    () => ({ user, loading, signIn, signInWithGoogle, signOut }),
    [user, loading, signIn, signInWithGoogle, signOut]
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

