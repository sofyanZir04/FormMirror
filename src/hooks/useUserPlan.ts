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

// In-memory cache with TTL
const planCache = new Map<string, { data: UserPlan; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export function useUserPlan() {
  const { user } = useAuth()
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const lastUserId = useRef<string | null>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const retryCount = useRef(0)
  const MAX_RETRIES = 2

  const fetchPlan = useCallback(async () => {
    if (!user?.id) {
      setUserPlan(null)
      setLoading(false)
      return
    }

    // Check cache with TTL
    const cached = planCache.get(user.id)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('Using cached plan')
      setUserPlan(cached.data)
      setLoading(false)
      return
    }

    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    setLoading(true)
    setError(null)

    // Create new abort controller
    abortControllerRef.current = new AbortController()

    try {
      const res = await fetch(`/api/user/plan?userId=${user.id}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
        signal: abortControllerRef.current.signal,
        // Increase timeout to 30 seconds
      })

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }

      const data = await res.json()

      if (!data?.plan) {
        throw new Error('Invalid response: missing plan')
      }

      // Cache with timestamp
      planCache.set(user.id, {
        data: data.plan,
        timestamp: Date.now(),
      })
      
      setUserPlan(data.plan)
      setError(null)
      retryCount.current = 0 // Reset retry count on success

    } catch (err: any) {
      // Ignore abort errors
      if (err.name === 'AbortError') {
        console.log('Request aborted')
        return
      }

      const msg = err.name === 'TimeoutError' 
        ? 'Request timed out' 
        : err.message || 'Network error'

      console.error('Plan fetch failed:', msg)
      setError(msg)

      // Retry with exponential backoff
      if (retryCount.current < MAX_RETRIES && !retryTimeoutRef.current) {
        const backoffDelay = Math.min(1000 * Math.pow(2, retryCount.current), 5000)
        retryCount.current++
        
        console.log(`Retrying in ${backoffDelay}ms (attempt ${retryCount.current}/${MAX_RETRIES})`)
        
        retryTimeoutRef.current = setTimeout(() => {
          retryTimeoutRef.current = null
          fetchPlan()
        }, backoffDelay)
      }
    } finally {
      setLoading(false)
      abortControllerRef.current = null
    }
  }, [user?.id])

  // Fetch on user change
  useEffect(() => {
    if (user?.id && lastUserId.current !== user.id) {
      lastUserId.current = user.id
      retryCount.current = 0 // Reset retry count for new user
      fetchPlan()
    } else if (!user) {
      setUserPlan(null)
      setLoading(false)
      lastUserId.current = null
    }

    return () => {
      // Cleanup
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = null
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }
    }
  }, [user?.id, fetchPlan])

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

// // In-memory cache
// const planCache = new Map<string, UserPlan>()

// export function useUserPlan() {
//   const { user } = useAuth()
//   const [userPlan, setUserPlan] = useState<UserPlan | null>(null)
//   const [loading, setLoading] = useState(true) // Start true for accurate UX
//   const [error, setError] = useState<string | null>(null)
//   const lastUserId = useRef<string | null>(null)
//   const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)

//   const fetchPlan = useCallback(async () => {
//     if (!user?.id) {
//       setUserPlan(null)
//       setLoading(false)
//       return
//     }

//     // 1. Check cache first
//     const cached = planCache.get(user.id)
//     if (cached) {
//       console.log('Using cached plan')
//       setUserPlan(cached)
//       setLoading(false)
//       return
//     }

//     setLoading(true)
//     setError(null)

//     try {
//       const res = await fetch(`/api/user/plan?userId=${user.id}`, {
//         method: 'GET',
//         headers: {
//           'Cache-Control': 'no-cache',
//         },
//         // Optional: Add timeout
//         signal: AbortSignal.timeout(15000),
//       })

//       if (!res.ok) {
//         throw new Error(`HTTP ${res.status}: ${res.statusText}`)
//       }

//       const data = await res.json()

//       if (!data?.plan) {
//         throw new Error('Invalid response: missing plan')
//       }

//       // Cache & update
//       planCache.set(user.id, data.plan)
//       setUserPlan(data.plan)
//       setError(null)

//     } catch (err: any) {
//       const msg = err.name === 'TimeoutError' 
//         ? 'Request timed out' 
//         : err.message || 'Network error'

//       console.error('Plan fetch failed:', msg)
//       setError(msg)

//       // Retry once after 600ms
//       if (!retryTimeoutRef.current) {
//         retryTimeoutRef.current = setTimeout(() => {
//           retryTimeoutRef.current = null
//           fetchPlan()
//         }, 600)
//       }
//     } finally {
//       setLoading(false)
//     }
//   }, [user?.id])
  

//   // Fetch on user change
//   useEffect(() => {
//     if (user?.id && lastUserId.current !== user.id) {
//       lastUserId.current = user.id
//       fetchPlan()
//     } else if (!user) {
//       setUserPlan(null)
//       setLoading(false)
//     }

//     return () => {
//       if (retryTimeoutRef.current) {
//         clearTimeout(retryTimeoutRef.current)
//         retryTimeoutRef.current = null
//       }
//     }
//   }, [user?.id, fetchPlan])

//   // Memoized return values
//   return {
//     userPlan,
//     isPro: userPlan?.isPro ?? false,
//     plan: userPlan?.plan ?? 'free',
//     features: userPlan?.features,
//     loading,
//     error,
//     hasRealData: !!userPlan?.realData,
//     refetch: fetchPlan,
//   }
// }
