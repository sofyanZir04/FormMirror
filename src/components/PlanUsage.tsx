'use client'

import { useEffect, useState } from 'react'
import { useUserPlan } from '@/hooks/useUserPlan'
import { supabase } from '@/lib/supabase/browser'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

export function PlanUsage() {
  const { userPlan, isPro, features, loading: planLoading } = useUserPlan()

  const [projectCount, setProjectCount] = useState(0)
  const [eventCount, setEventCount] = useState(0)
  const [loading, setLoading] = useState(true)
  
  // Fetch usage values from Supabase
  useEffect(() => {
    const userId = userPlan?.realData?.userId
    if (!userId) return

    async function loadUsage() {
      setLoading(true)

      try {
        //
        // 1️⃣ Fetch all projects owned by this user
        //
        const { data: userProjects, count: projectTotal, error: projErr } = await supabase
          .from('projects')
          .select('id', { count: 'exact' })
          .eq('user_id', userId)

        if (projErr) throw projErr

        setProjectCount(projectTotal || 0)

        //
        // 2️⃣ Get project IDs so we can count events linked to those projects
        //
        const projectIds = userProjects?.map((p) => p.id) || []

        let eventTotal = 0

        // If no projects, events = 0
        if (projectIds.length > 0) {
          //
          // 3️⃣ Count events WHERE project_id IN (all user project IDs)
          //
          const { count, error: eventErr } = await supabase
            .from('form_events')
            .select('*', { count: 'exact', head: true })
            .in('project_id', projectIds)

          if (eventErr) throw eventErr

          eventTotal = count || 0
        }

        setEventCount(eventTotal)
      } catch (e) {
        console.error('Usage fetch error:', e)
      }

      setLoading(false)
    }

    loadUsage()
  }, [userPlan?.realData?.userId])

  // useEffect(() => {
  //   const userPlanId = userPlan?.realData?.userId
  //   async function loadUsage() {      
  //     console.log('user planId:', userPlanId)
  //     if (!userPlanId) return
  //     setLoading(true)

  //     try {
  //       // Count projects
  //       const { count: projectTotal } = await supabase
  //         .from('projects')
  //         .select('*', { count: 'exact', head: true })
  //         .eq('user_id', userPlan?.realData?.userId)

  //       // Count form interactions (events)
  //       const { count: eventTotal } = await supabase      
  //         .from('form_events')    
  //         .select('*', { count: 'exact', head: true })
  //         .eq('user_id', userPlan?.realData?.userId)

  //       setProjectCount(projectTotal || 0)
  //       setEventCount(eventTotal || 0)
  //     } catch (e) {
  //       console.error('Usage fetch error:', e)
  //     }

  //     setLoading(false)
  //   }

  //   loadUsage()
  // }, [userPlan?.realData?.userId])

  // Still loading plan or usage
  if (loading || planLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
      </div>
    )
  }

  const currentFeatures = isPro ? features?.pro : features?.free
  if (!currentFeatures) {
    return <div className="text-center text-gray-400">Unable to load usage data</div>
  }

  // Prepare limits
  const maxProjects = currentFeatures.maxProjects === 'Unlimited' ? Infinity : currentFeatures.maxProjects
  const maxInteractions = currentFeatures.maxFormInteractions === 'Unlimited' ? Infinity : currentFeatures.maxFormInteractions

  // Calculate percentages
  const projectPct = maxProjects === Infinity ? 0 : Math.min((projectCount / maxProjects) * 100, 100)
  const eventPct = maxInteractions === Infinity ? 0 : Math.min((eventCount / maxInteractions) * 100, 100)

  return (
    <div className="space-y-4">

      {/* Project Usage */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">Projects</span>
          <span className="text-sm font-bold">
            {projectCount} / {maxProjects === Infinity ? '∞' : maxProjects}
          </span>
        </div>

        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-violet-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${projectPct}%` }}
          />
        </div>
      </div>

      {/* Form Interactions */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">Form Interactions</span>
          <span className="text-sm font-bold">
            {eventCount} / {maxInteractions === Infinity ? '∞' : maxInteractions}
          </span>
        </div>

        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${eventPct}%` }}
          />
        </div>
      </div>

      {/* Plan Info */}
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

      {/* Upgrade CTA */}
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

// 'use client'

// import { useUserPlan } from '@/hooks/useUserPlan'
// import { Loader2 } from 'lucide-react'
// import Link from 'next/link'

// export function PlanUsage() {
//   const { isPro, loading, features, userPlan } = useUserPlan()

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-8">
//         <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
//       </div>
//     )
//   }

//   const currentFeatures = isPro ? features?.pro : features?.free

//   if (!currentFeatures) {
//     return (
//       <div className="text-center text-gray-400">
//         <p>Unable to load usage data</p>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-4">
//       {/* Projects */}
//       <div>
//         <div className="flex items-center justify-between mb-2">
//           <span className="text-sm text-gray-300">Projects</span>
//           <span className="text-sm font-bold">
//             0 / {currentFeatures.maxProjects === 'Unlimited' ? '∞' : currentFeatures.maxProjects}
//           </span>
//         </div>
//         <div className="w-full bg-white/10 rounded-full h-2">
//           <div 
//             className="bg-gradient-to-r from-violet-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
//             style={{ width: currentFeatures.maxProjects === 'Unlimited' ? '0%' : '0%' }}
//           />
//         </div>
//       </div>

//       {/* Form Interactions */}
//       <div>
//         <div className="flex items-center justify-between mb-2">
//           <span className="text-sm text-gray-300">Form Interactions</span>
//           <span className="text-sm font-bold">
//             0 / {currentFeatures.maxFormInteractions === 'Unlimited' ? '∞' : currentFeatures.maxFormInteractions}
//           </span>
//         </div>
//         <div className="w-full bg-white/10 rounded-full h-2">
//           <div 
//             className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-300"
//             style={{ width: '0%' }}
//           />
//         </div>
//       </div>

//       {/* Plan Details */}
//       <div className="pt-4 border-t border-white/10 space-y-2">
//         <div className="flex items-center justify-between text-sm">
//           <span className="text-gray-400">Data Retention</span>
//           <span className="font-medium">{currentFeatures.dataRetention}</span>
//         </div>
//         <div className="flex items-center justify-between text-sm">
//           <span className="text-gray-400">Support</span>
//           <span className="font-medium">{currentFeatures.support}</span>
//         </div>
//       </div>

//       {/* Upgrade CTA for Free Users */}
//       {!isPro && (
//         <div className="pt-4">
//           <Link
//             href="/pricing"
//             className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold hover:opacity-90 transition-all"
//           >
//             Upgrade to Pro
//           </Link>
//         </div>
//       )}
//     </div>
//   )
// }