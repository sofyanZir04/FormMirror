'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export interface PlanFeatures {
  maxProjects: number | string
  maxFormInteractions: number | string
  dataRetention: string
  support: string
}

export interface UserPlan {
  plan: 'free' | 'pro'
  isPro: boolean
  features: {
    free: PlanFeatures
    pro: PlanFeatures
  }
  realData?: {
    planId: string
    userId: string
    planType: string
    createdAt: string
    updatedAt: string
  }
}

// In-memory cache
const planCache = new Map<string, UserPlan>()

export function useUserPlan() {
  const { user } = useAuth()
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null)
  const [loading, setLoading] = useState(true) // Start true for accurate UX
  const [error, setError] = useState<string | null>(null)
  const lastUserId = useRef<string | null>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const fetchPlan = useCallback(async () => {
    if (!user?.id) {
      setUserPlan(null)
      setLoading(false)
      return
    }

    // 1. Check cache first
    const cached = planCache.get(user.id)
    if (cached) {
      console.log('Using cached plan')
      setUserPlan(cached)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/user/plan?userId=${user.id}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
        // Optional: Add timeout
        signal: AbortSignal.timeout(8000),
      })

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }

      const data = await res.json()

      if (!data?.plan) {
        throw new Error('Invalid response: missing plan')
      }

      // Cache & update
      planCache.set(user.id, data.plan)
      setUserPlan(data.plan)
      setError(null)

    } catch (err: any) {
      const msg = err.name === 'TimeoutError' 
        ? 'Request timed out' 
        : err.message || 'Network error'

      console.error('Plan fetch failed:', msg)
      setError(msg)

      // Retry once after 600ms
      if (!retryTimeoutRef.current) {
        retryTimeoutRef.current = setTimeout(() => {
          retryTimeoutRef.current = null
          fetchPlan()
        }, 600)
      }
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  // Fetch on user change
  useEffect(() => {
    if (user?.id && lastUserId.current !== user.id) {
      lastUserId.current = user.id
      fetchPlan()
    } else if (!user) {
      setUserPlan(null)
      setLoading(false)
    }

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = null
      }
    }
  }, [user?.id, fetchPlan])

  // Memoized return values
  return {
    userPlan,
    isPro: userPlan?.isPro ?? false,
    plan: userPlan?.plan ?? 'free',
    features: userPlan?.features,
    loading,
    error,
    hasRealData: !!userPlan?.realData,
    refetch: fetchPlan,
  }
}

// 'use client'

// import { useState, useEffect, useRef, useCallback } from 'react'
// import { useAuth } from '@/contexts/AuthContext'

// export interface PlanFeatures {
//   maxProjects: number | string
//   maxFormInteractions: number | string
//   dataRetention: string
//   support: string
// }

// export interface UserPlan {
//   plan: 'free' | 'pro'
//   isPro: boolean
//   features: {
//     free: PlanFeatures
//     pro: PlanFeatures
//   }
//   realData?: {
//     planId: string
//     userId: string
//     planType: string
//     createdAt: string
//     updatedAt: string
//   }
// }

// // Simple cache to prevent unnecessary API calls
// const planCache = new Map<string, UserPlan>()

// export function useUserPlan() {
//   const { user } = useAuth()
//   const [userPlan, setUserPlan] = useState<UserPlan | null>(null)
//   const [loading, setLoading] = useState(false) // Start with false for faster loading
//   const [error, setError] = useState<string | null>(null)
//   const [retryCount, setRetryCount] = useState(0)
//   const lastUserId = useRef<string | null>(null)
//   const maxRetries = 2 // Reduced from 3 to 2
//   const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
//   const retryCountRef = useRef(0)

//   const retry = useCallback(() => {
//     retryCountRef.current += 1
//     setRetryCount(retryCountRef.current)
//     setError(null)
//   }, [])

//   const fetchUserPlan = useCallback(async () => {
//     if (!user?.id) {
//       setLoading(false)
//       return
//     }

//     // Check cache first for instant loading
//     const cachedPlan = planCache.get(user.id)
//     if (cachedPlan) {
//       console.log('⚡ Using cached plan data')
//       setUserPlan(cachedPlan)
//       setLoading(false)
//       return
//     }

//     setLoading(true)
//     setError(null)
        
//     try {
//       const response = await fetch(`/api/user/plan?userId=${user.id}`, {
//         headers: {
//           'Cache-Control': 'no-cache'
//         }
//               })

//         console.log('📡 API Response:', response.status, response.statusText)

//         if (!response.ok) {
//         throw new Error(`API error: ${response.status}`)
//       }

//       const data = await response.json()
//       console.log('📊 API Response data:', data)
//       console.log('📊 API Response data.plan:', data.plan)

//       if (data.plan) {
//         setUserPlan(data.plan)
//         setError(null)
//         // Cache the successful result
//         planCache.set(user.id, data.plan)
//       } else if (data.error) {
//         throw new Error(data.error)
//       } else {
//         throw new Error('Unexpected API response')
//       }

//     } catch (error) {
//       console.error('❌ Failed to fetch user plan:', error)
//       setError(error instanceof Error ? error.message : 'Failed to fetch user plan')
      
//       // Simple retry logic - only retry once
//       if (retryCountRef.current < 1) {
//         retryCountRef.current++
//         retryTimeoutRef.current = setTimeout(() => {
//           fetchUserPlan()
//         }, 500) // Faster retry: 500ms instead of 1s
//       }
//     } finally {
//       setLoading(false)
//     }
//   }, [user?.id])

//   useEffect(() => {
//     // Clear any existing timeout when user changes
//     if (retryTimeoutRef.current) {
//       clearTimeout(retryTimeoutRef.current)
//       retryTimeoutRef.current = null
//     }

//     // Only fetch if user ID changed
//     if (user?.id && lastUserId.current !== user.id) {
//       lastUserId.current = user.id
//       fetchUserPlan()
//     }

//     // Cleanup function to clear timeout
//     return () => {
//       if (retryTimeoutRef.current) {
//         clearTimeout(retryTimeoutRef.current)
//         retryTimeoutRef.current = null
//       }
//     }
//   }, [user?.id, fetchUserPlan]) // Include fetchUserPlan to fix ESLint warning

//   // Only return real data, no fallbacks
//   return {
//     userPlan,
//     isPro: userPlan?.isPro || false,
//     plan: userPlan?.plan || 'free',
//     features: userPlan?.features,
//     loading,
//     error,
//     hasRealData: !!userPlan?.realData,
//     retry,
//     retryCount,
//     maxRetries,
//   }
// } 