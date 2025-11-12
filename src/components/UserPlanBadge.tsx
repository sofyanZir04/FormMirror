// components/UserPlanBadge.tsx
'use client'

import { useUserPlan } from '@/hooks/useUserPlan'
import { Crown, Sparkles } from 'lucide-react'

export function UserPlanBadge() {
  const { isPro, loading } = useUserPlan()

  if (loading) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-xs font-medium text-gray-400 animate-pulse">
        <div className="w-3 h-3 bg-white/20 rounded-full" />
        Loading...
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
      isPro
        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30'
        : 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30'
    }`}>
      {isPro ? (
        <>
          <Crown className="h-3.5 w-3.5" />
          Pro
        </>
      ) : (
        <>
          <Sparkles className="h-3.5 w-3.5" />
          Free
        </>
      )}
    </div>
  )
}
