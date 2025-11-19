// src/components/TrialBadge.tsx
// Optional: Add this badge to show trial status in insights section

import { Sparkles, Clock, Zap } from 'lucide-react'
import Link from 'next/link'

interface TrialBadgeProps {
  isInTrial: boolean
  daysLeft: number
  isPro: boolean
}

export default function TrialBadge({ isInTrial, daysLeft, isPro }: TrialBadgeProps) {
  if (isPro) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 rounded-full">
        <Zap className="h-4 w-4 text-emerald-400" />
        <span className="text-sm font-bold text-emerald-300">Pro</span>
      </div>
    )
  }

  if (isInTrial) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 rounded-full">
        <Clock className="h-4 w-4 text-blue-400" />
        <span className="text-sm font-bold text-blue-300">
          Trial: {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
        </span>
      </div>
    )
  }

  return (
    <Link 
      href="/dashboard/pricing"
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-500/20 border border-gray-500/30 rounded-full hover:bg-gray-500/30 transition-all"
    >
      <Sparkles className="h-4 w-4 text-gray-400" />
      <span className="text-sm font-bold text-gray-400">Trial Expired</span>
    </Link>
  )
}

// Usage in your insights section:
// Add this below the "AI Analysis" heading:

/*
<div className="flex items-center gap-2 mb-2">
  <h3 className="text-xl font-black text-white">AI Analysis</h3>
  <TrialBadge 
    isInTrial={insightsAccess.isInTrial}
    daysLeft={insightsAccess.trialDaysLeft}
    isPro={insightsAccess.isPro}
  />
</div>
*/