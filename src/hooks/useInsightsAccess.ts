// src/hooks/useInsightsAccess.ts
// src/hooks/useInsightsAccess.ts
import { useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useUserPlan } from '@/hooks/useUserPlan'

const TRIAL_DAYS = 20

export interface InsightsAccess {
  hasAccess: boolean
  isPro: boolean
  isInTrial: boolean
  trialDaysLeft: number
  trialEndsAt: Date | null
  reason: 'pro' | 'trial' | 'none'
  loading: boolean
}

export function useInsightsAccess(): InsightsAccess {
  const { user } = useAuth()
  const { isPro, loading: planLoading } = useUserPlan()

  return useMemo(() => {
    // Still loading plan → show loading state
    if (planLoading || !user) {
      return {
        hasAccess: false,
        isPro: false,
        isInTrial: false,
        trialDaysLeft: 0,
        trialEndsAt: null,
        reason: 'none',
        loading: true,
      }
    }

    // Pro users = full access forever
    if (isPro) {
      return {
        hasAccess: true,
        isPro: true,
        isInTrial: false,
        trialDaysLeft: 0,
        trialEndsAt: null,
        reason: 'pro',
        loading: false,
      }
    }

    // Free user → check if within 7-day trial based on account creation
    if (!user.createdAt) {
      return {
        hasAccess: false,
        isPro: false,
        isInTrial: false,
        trialDaysLeft: 0,
        trialEndsAt: null,
        reason: 'none',
        loading: false,
      }
    }

    const createdAt = new Date(user.createdAt)
    const trialEnd = new Date(createdAt)
    trialEnd.setDate(trialEnd.getDate() + TRIAL_DAYS)

    const now = new Date()
    const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (86_400_000)) // 24*60*60*1000
    const inTrial = daysLeft > 0

    return {
      hasAccess: inTrial,
      isPro: false,
      isInTrial: inTrial,
      trialDaysLeft: Math.max(0, daysLeft),
      trialEndsAt: trialEnd,
      reason: inTrial ? 'trial' : 'none',
      loading: false,
    }
  }, [user, isPro, planLoading])
}


// import { useMemo } from 'react'
// import { useAuth } from '@/contexts/AuthContext'
// import { useUserPlan } from '@/hooks/useUserPlan'

// interface InsightsAccess {
//   hasAccess: boolean
//   isPro: boolean
//   isInTrial: boolean
//   trialDaysLeft: number
//   trialEndsAt: Date | null
//   reason: 'pro' | 'trial' | 'expired'
// }

// const TRIAL_DAYS = 7

// export function useInsightsAccess(): InsightsAccess {
//   const { user } = useAuth()
//   const { isPro } = useUserPlan()

//   return useMemo(() => {
//     // Pro users always have access
//     if (isPro) {
//       return {
//         hasAccess: true,
//         isPro: true,
//         isInTrial: false,
//         trialDaysLeft: 0,
//         trialEndsAt: null,
//         reason: 'pro'
//       }
//     }

//     // No user = no access
//     if (!user?.created_at) {
//       return {
//         hasAccess: false,
//         isPro: false,
//         isInTrial: false,
//         trialDaysLeft: 0,
//         trialEndsAt: null,
//         reason: 'expired'
//       }
//     }

//     // Calculate trial period
//     const accountCreatedAt = new Date(user.created_at)
//     const now = new Date()
//     const trialEndsAt = new Date(accountCreatedAt)
//     trialEndsAt.setDate(trialEndsAt.getDate() + TRIAL_DAYS)

//     const daysLeft = Math.ceil((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
//     const isInTrial = daysLeft > 0

//     return {
//       hasAccess: isInTrial,
//       isPro: false,
//       isInTrial,
//       trialDaysLeft: Math.max(0, daysLeft),
//       trialEndsAt,
//       reason: isInTrial ? 'trial' : 'expired'
//     }
//   }, [user, isPro])
// }