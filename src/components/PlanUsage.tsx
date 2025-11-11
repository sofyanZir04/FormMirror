'use client'

import { useUserPlan } from '@/hooks/useUserPlan'

export function PlanUsage() {
  const { isPro } = useUserPlan()

  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-gray-200">Max Projects:</span>
        <span className="font-medium">{isPro ? 'Unlimited' : '3'}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-200">Form Interactions:</span>
        <span className="font-medium">{isPro ? 'Unlimited' : '1,000/month'}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-200">Data Retention:</span>
        <span className="font-medium">{isPro ? '2 years' : '30 days'}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-200">Support:</span>
        <span className="font-medium">{isPro ? 'Priority' : 'Community'}</span>
      </div>
      
      {!isPro && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 Upgrade to Pro for unlimited projects and priority support!
          </p>
        </div>
      )}
    </div>
  )
} 