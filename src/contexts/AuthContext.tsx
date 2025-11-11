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
          console.log('User authenticated:', session.user.email)
          setUser(transformUser(session.user))
        } else {
          console.log('No active session')
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

// 'use client'

// import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
// import { useRouter } from 'next/navigation'
// import toast from 'react-hot-toast'
// import { supabase } from '@/lib/supabase/browser'
// import { encryptData } from '@/lib/encryption'
// import type { User as SupabaseUser } from '@supabase/supabase-js'

// // Define interfaces for authentication
// interface User {
//   id: string
//   email: string
//   plan: 'free' | 'pro'
//   lastLogin?: string
// }

// interface AuthContextType {
//   user: User | null
//   loading: boolean
//   signIn: (email: string, password: string) => Promise<void>
//   signInWithGoogle: () => Promise<void>
//   signOut: () => Promise<void>
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)
//   const router = useRouter()

//   // Convert Supabase user to our User interface
//   const transformUser = useCallback((supabaseUser: SupabaseUser): User => {
//     return {
//       id: supabaseUser.id,
//       email: supabaseUser.email!,
//       plan: 'free', // Default plan, can be updated from user metadata or profiles table
//       lastLogin: new Date().toISOString()
//     }
//   }, [])

//   // Check authentication status on app load and listen for auth changes
//   useEffect(() => {
//     let mounted = true
    
//     // Get initial session
//     const getInitialSession = async () => {
//       try {
//         // Add timeout to prevent hanging
//         const sessionPromise = supabase.auth.getSession()
//         const timeoutPromise = new Promise((_, reject) => 
//           setTimeout(() => reject(new Error('Session check timeout')), 3000)
//         )
        
//         const { data: { session }, error } = await Promise.race([sessionPromise, timeoutPromise]) as any
        
//         if (mounted) {
//           if (error) {
//             console.error('🚨 Error getting session:', error)
//             setUser(null)
//             setLoading(false)
//           } else if (session?.user) {
//             console.log('✅ User authenticated:', session.user.email)
            
//             // Set user immediately for faster UI response
//             setUser(transformUser(session.user))
//             setLoading(false)
//           } else {
//             console.log('❌ User not authenticated')
//             setUser(null)
//             setLoading(false)
//           }
//         }
//       } catch (error) {
//         console.error('🚨 Session check failed:', error)
//         if (mounted) {
//           setUser(null)
//           setLoading(false)
//         }
//       }
//     }

//     getInitialSession()

//     // Listen for auth changes
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         if (!mounted) return

//         console.log('🔄 Auth state changed:', event)
        
//         if (session?.user) {
//           console.log('✅ User session active:', session.user.email)
          
//           // Set user immediately for faster UI response
//           setUser(transformUser(session.user))
//           setLoading(false)
          

//         } else {
//           console.log('❌ User session ended')
//           setUser(null)
//           setLoading(false)
//         }
//       }
//     )

//     return () => {
//       mounted = false
//       subscription.unsubscribe()
//     }
//   }, [transformUser])

//   const signIn = useCallback(async (email: string, password: string): Promise<void> => {
//     try {
//       console.log('🔐 Supabase login attempt:', { email: email.trim() })
      
//       // Encrypt sensitive data before sending to Supabase
//       const encryptedPassword = encryptData({ password })
      
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email: email.trim(),
//         password: password // Supabase handles password hashing internally
//       })

//       if (error) {
//         console.error('❌ Supabase login failed:', error.message)
//         toast.error(error.message || 'Login failed')
//         throw new Error(error.message)
//       }

//       if (data.user) {
//         console.log('✅ Supabase login successful:', data.user.email)
//         toast.success('Login successful!')
//         // User state will be updated automatically by onAuthStateChange
//       }
//     } catch (error: any) {
//       console.error('🚨 Login error:', error)
//       toast.error(error.message || 'Login failed')
//       throw error
//     }
//   }, [])

//   const signInWithGoogle = useCallback(async (): Promise<void> => {
//     try {
//       console.log('🔐 Google sign-in attempt')
      
//       const { data, error } = await supabase.auth.signInWithOAuth({
//         provider: 'google',
//         options: {
//           redirectTo: `${window.location.origin}/dashboard`
//         }
//       })

//       if (error) {
//         console.error('❌ Google sign-in failed:', error.message)
//         toast.error(error.message || 'Google sign-in failed')
//         throw new Error(error.message)
//       }

//       console.log('✅ Google sign-in initiated')
//       // Redirect will happen automatically
//     } catch (error: any) {
//       console.error('🚨 Google sign-in error:', error)
//       toast.error(error.message || 'Google sign-in failed')
//       throw error
//     }
//   }, [])

//   const signOut = useCallback(async (): Promise<void> => {
//     try {
//       console.log('🚪 Logging out...')
      
//       // Immediately clear local state and redirect for faster UX
//       setUser(null)
//       setLoading(false)
//       toast.success('Logged out successfully')
//       router.push('/auth/login')
      
//       // Handle Supabase logout in the background (non-blocking)
//       supabase.auth.signOut().then(({ error }) => {
//         if (error) {
//           console.error('❌ Background logout error:', error.message)
//           // Don't show error to user since they're already logged out locally
//         } else {
//           console.log('✅ Background logout successful')
//         }
//       }).catch((error) => {
//         console.error('🚨 Background logout failed:', error)
//       })
      
//     } catch (error: any) {
//       console.error('🚨 Logout error:', error)
//       // Even if something fails, ensure user is logged out locally
//       setUser(null)
//       setLoading(false)
//       toast.success('Logged out')
//       router.push('/auth/login')
//     }
//   }, [router])

//   // Memoize the context value to prevent unnecessary re-renders
//   const contextValue = useMemo(() => ({
//     user,
//     loading,
//     signIn,
//     signInWithGoogle,
//     signOut,
//   }), [user, loading, signIn, signInWithGoogle, signOut])

//   return (
//     <AuthContext.Provider value={contextValue}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }