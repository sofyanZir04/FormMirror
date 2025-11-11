'use client'

import { useEffect } from 'react'
import { useOnboarding } from '@/hooks/useOnboarding'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'

export default function Onboarding() {
  const { markAsSeen } = useOnboarding()

  useEffect(() => {
    // Auto-mark as seen after 3 seconds (or on button click)
    const timer = setTimeout(markAsSeen, 3000)
    return () => clearTimeout(timer)
  }, [markAsSeen])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6">
          <img src="/logo.svg" alt="FormMirror" />
        </div>
        <h1 className="text-3xl font-black text-white mb-4">Welcome to FormMirror</h1>
        <p className="text-gray-300 mb-8">
          Track form drop-offs in real time. No cookies. No PII.
        </p>

        <div className="space-y-4">
          <Link
            href="/dashboard/projects/new"
            onClick={markAsSeen}
            className="block w-full py-4 bg-white text-violet-600 font-bold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
          >
            + Create Your First Project
          </Link>

          <button
            onClick={markAsSeen}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            <Link
              href="/dashboard"
              className="block w-full text-center py-4 bg-white text-violet-600 font-bold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
            >
              Skip for now
            </Link>
          </button>
        </div>
      </div>
    </div>
  )
}
// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'
// import { ArrowRight, Check } from 'lucide-react'

// export default function Onboarding() {
//   const [step, setStep] = useState(1)

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 flex items-center justify-center p-6">
//       <div className="max-w-md w-full">
//         {step === 1 && (
//           <div className="text-center">
//             <div className="w-20 h-20 mx-auto mb-6">
//               <img src="/logo.svg" alt="FormMirror" />
//             </div>
//             <h1 className="text-3xl font-black text-white mb-4">Welcome to FormMirror</h1>
//             <p className="text-gray-300 mb-8">See exactly where users drop off in your forms. No cookies. No PII.</p>
//             <button
//               onClick={() => setStep(2)}
//               className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-400 hover:to-teal-500 transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
//             >
//               Get Started <ArrowRight className="h-5 w-5" />
//             </button>
//           </div>
//         )}

//         {step === 2 && (
//           <div>
//             <h2 className="text-2xl font-black text-white mb-6">Create Your First Project</h2>
//             <Link
//               href="/dashboard/projects/new"
//               className="block w-full text-center py-4 bg-white text-violet-600 font-bold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
//             >
//               + New Project
//             </Link>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }