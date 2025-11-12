// components/UserPlanBadge.tsx
'use client'

import { useUserPlan } from '@/hooks/useUserPlan'
import { Crown, Loader2 } from 'lucide-react'

export function UserPlanBadge() {
  const { isPro, loading, plan } = useUserPlan()

  if (loading) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm font-medium">Loading...</span>
      </div>
    )
  }

  if (isPro) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl shadow-lg">
        <Crown className="h-4 w-4 text-white" />
        <span className="text-sm font-bold text-white">Pro Plan</span>
      </div>
    )
  }

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/20">
      <span className="text-sm font-medium text-gray-300">Free Plan</span>
    </div>
  )
}


// components/UserPlanBadge.tsx
// 'use client'

// import { useUserPlan } from '@/hooks/useUserPlan'

// // Simple SVG fallbacks
// const CrownIcon = ({ className }: { className?: string }) => (
//   <svg className={className} fill="currentColor" viewBox="0 0 24 24">
//     <path d="M5 22h14a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1zm1.5-6L8 12l1.5 4h5l1.5-4 1.5 7h-8l-.5-4z"/>
//   </svg>
// );

// const SparklesIcon = ({ className }: { className?: string }) => (
//   <svg className={className} fill="currentColor" viewBox="0 0 24 24">
//     <path d="M12 0l1.09 3.09L16 2l-1.09 3.09L18 6l-3.09 1.09L16 10l-3.09-1.09L12 12l-1.09-3.09L8 10l1.09-3.09L6 6l3.09-1.09L8 2l3.09 1.09L12 0zm0 14l.55 1.55L14 15l-.55 1.55L15 17l-1.55.55L14 19l-1.55-.55L12 19l-.55.55L10 19l.55-1.55L9 17l1.55-.55L10 15l1.55.55L12 14z"/>
//   </svg>
// );

// const UserPlanBadge = () => {
//   const { isPro, loading } = useUserPlan()

//   if (loading) {
//     return (
//       <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-xs font-medium text-gray-400 animate-pulse">
//         <div className="w-3 h-3 bg-white/20 rounded-full" />
//         Loading...
//       </div>
//     )
//   }

//   return (
//     <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
//       isPro
//         ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30'
//         : 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30'
//     }`}>
//       {isPro ? (
//         <>
//           <CrownIcon className="h-3.5 w-3.5" />
//           Pro
//         </>
//       ) : (
//         <>
//           <SparklesIcon className="h-3.5 w-3.5" />
//           Free
//         </>
//       )}
//     </div>
//   )
// }

// export default UserPlanBadge;

