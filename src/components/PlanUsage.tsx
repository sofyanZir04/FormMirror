'use client'

import { useUserPlan } from '@/hooks/useUserPlan'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

export function PlanUsage() {
  const { isPro, loading, features, userPlan } = useUserPlan()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
      </div>
    )
  }

  const currentFeatures = isPro ? features?.pro : features?.free

  if (!currentFeatures) {
    return (
      <div className="text-center text-gray-400">
        <p>Unable to load usage data</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Projects */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">Projects</span>
          <span className="text-sm font-bold">
            0 / {currentFeatures.maxProjects === 'Unlimited' ? '∞' : currentFeatures.maxProjects}
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-violet-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: currentFeatures.maxProjects === 'Unlimited' ? '0%' : '0%' }}
          />
        </div>
      </div>

      {/* Form Interactions */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">Form Interactions</span>
          <span className="text-sm font-bold">
            0 / {currentFeatures.maxFormInteractions === 'Unlimited' ? '∞' : currentFeatures.maxFormInteractions}
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-300"
            style={{ width: '0%' }}
          />
        </div>
      </div>

      {/* Plan Details */}
      <div className="pt-4 border-t border-white/10 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Data Retention</span>
          <span className="font-medium">{currentFeatures.dataRetention}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Support</span>
          <span className="font-medium">{currentFeatures.support}</span>
        </div>
      </div>

      {/* Upgrade CTA for Free Users */}
      {!isPro && (
        <div className="pt-4">
          <Link
            href="/pricing"
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold hover:opacity-90 transition-all"
          >
            Upgrade to Pro
          </Link>
        </div>
      )}
    </div>
  )
}