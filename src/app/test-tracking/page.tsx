'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

// Only allow in development OR for authenticated admins
const isDev = process.env.NODE_ENV === 'development'
const isAdmin = false // Replace with real auth check: e.g., useSession().data?.user?.role === 'admin'

export default function TestTrackingPage() {
  const [projectId, setProjectId] = useState('test-project-123')
  const [isTracking, setIsTracking] = useState(false)

  // BLOCK ACCESS IN PRODUCTION UNLESS ADMIN
  if (!isDev && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-center border border-white/20">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-300">This is an internal testing tool.</p>
        </div>
      </div>
    )
  }

  useEffect(() => {
    const checkTracking = () => {
      const script = document.querySelector('script[data-project-id]')
      setIsTracking(!!script)
      console.log(script ? 'Tracking Active' : 'Tracking Not Loaded')
    }
    checkTracking()
    setTimeout(checkTracking, 1000)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 text-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-emerald-400" />
              <div>
                <h1 className="text-2xl font-black">FormMirror Tracking Test</h1>
                <p className="text-sm text-gray-300">Internal debug tool – not for production</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`}></div>
              <span className="text-sm font-medium">
                {isTracking ? 'Tracking Active' : 'Not Loaded'}
              </span>
            </div>
          </div>
        </div>

        {/* Config */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/10">
          <label className="block text-sm font-medium mb-2">Project ID</label>
          <input
            type="text"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="e.g. proj_abc123"
          />
          <p className="text-xs text-gray-400 mt-2">
            Change and reload to test different projects
          </p>
        </div>

        {/* Test Form */}
        <form className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            Test Form Interactions
          </h2>

          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" name="name" className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="John Doe" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" name="email" className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="john@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea name="message" rows={3} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="Type something..."></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select name="category" className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400">
              <option value="">Select...</option>
              <option value="support">Support</option>
              <option value="feedback">Feedback</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-bold hover:from-emerald-400 hover:to-teal-500 transition-all transform hover:scale-[1.02]"
          >
            Submit Form
          </button>
        </form>

        {/* Instructions */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            Debug Instructions
          </h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>• Open DevTools (F12) → Console to see events</li>
            <li>• Focus/blur fields → should log <code className="bg-white/10 px-2 py-1 rounded">focus</code> / <code className="bg-white/10 px-2 py-1 rounded">blur</code></li>
            <li>• Submit → logs <code className="bg-white/10 px-2 py-1 rounded">submit</code></li>
            <li>• Leave page → logs <code className="bg-white/10 px-2 py-1 rounded">abandon</code></li>
            <li>• Check Network tab for API calls to <code className="bg-white/10 px-2 py-1 rounded">/api/track</code></li>
          </ul>
        </div>

        {/* Warning */}
        {!isDev && (
          <div className="mt-6 bg-red-600/20 border border-red-500/50 rounded-2xl p-4 text-center">
            <p className="text-sm font-medium text-red-300">
              This tool is only visible to admins in production.
            </p>
          </div>
        )}
      </div>

      {/* Tracking Script */}
      <Script
        src="/track.js"
        data-project-id={projectId}
        data-form-selector="form"
        strategy="afterInteractive"
      />
    </div>
  )
}
// 'use client'

// import { useEffect, useState } from 'react'
// import Script from 'next/script'

// export default function TestTrackingPage() {
//   const [projectId, setProjectId] = useState('test-project-123')
//   const [isTracking, setIsTracking] = useState(false)

//   useEffect(() => {
//     // Check if tracking script is loaded
//     const checkTracking = () => {
//       const script = document.querySelector('script[data-project-id]')
//       if (script) {
//         setIsTracking(true)
//         console.log('✅ Tracking script found:', script)
//       } else {
//         setIsTracking(false)
//         console.log('❌ Tracking script not found')
//       }
//     }

//     checkTracking()
//     // Check again after a short delay
//     setTimeout(checkTracking, 1000)
//   }, [])

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-2xl mx-auto px-4">
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h1 className="text-2xl font-bold text-gray-900 mb-4">
//             FormMirror Tracking Test
//           </h1>
          
//           <div className="mb-6 p-4 bg-blue-50 rounded-lg">
//             <h2 className="text-lg font-semibold text-blue-900 mb-2">
//               Tracking Status
//             </h2>
//             <div className="flex items-center gap-2">
//               <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-green-500' : 'bg-red-500'}`}></div>
//               <span className="text-sm">
//                 {isTracking ? 'Tracking Active' : 'Tracking Not Active'}
//               </span>
//             </div>
//             <p className="text-sm text-blue-700 mt-2">
//               Project ID: {projectId}
//             </p>
//           </div>

//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Project ID (for testing):
//             </label>
//             <input
//               type="text"
//               value={projectId}
//               onChange={(e) => setProjectId(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter project ID"
//             />
//           </div>

//           <form className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Name
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter your name"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter your email"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Message
//               </label>
//               <textarea
//                 name="message"
//                 rows={4}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter your message"
//               ></textarea>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Category
//               </label>
//               <select
//                 name="category"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">Select a category</option>
//                 <option value="general">General</option>
//                 <option value="support">Support</option>
//                 <option value="feedback">Feedback</option>
//               </select>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               Submit Form
//             </button>
//           </form>

//           <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//             <h3 className="text-sm font-medium text-gray-700 mb-2">
//               Instructions:
//             </h3>
//             <ul className="text-sm text-gray-600 space-y-1">
//               <li>• Open browser console (F12) to see tracking logs</li>
//               <li>• Fill out the form fields to trigger tracking events</li>
//               <li>• Submit the form to see submit events</li>
//               <li>• Close the page to see abandon events</li>
//               <li>• Check your server logs for API calls</li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* Tracking Script */}
//       <Script
//         src="/track.js"
//         data-project-id={projectId}
//         data-form-selector="form"
//         strategy="afterInteractive"
//       />
//     </div>
//   )
// } 