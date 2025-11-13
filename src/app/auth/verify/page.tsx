import { Suspense } from 'react'
import VerifyClient from './VerifyClient'

// This is a Server Component — no 'use client'
export default function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string
    error_code?: string
    error_description?: string
    token?: string
    type?: string
  }>
}) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-white">Loading verification...</div>
      </div>
    }>
      <VerifyClient searchParams={searchParams} />
    </Suspense>
  )
}
// 'use client'
// export const dynamic = 'force-dynamic'
// import { useEffect, useState } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { supabase } from '@/lib/supabase/browser'
// import { handleEmailConfirmation } from '@/lib/users'
// import { CheckCircle, XCircle, Loader2, Mail, Shield, ArrowRight,Clock } from 'lucide-react'
// import Link from 'next/link'

// export default function VerifyPage() {
//   const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
//   const [message, setMessage] = useState('')
//   const [countdown, setCountdown] = useState(3)
//   const router = useRouter()
//   const searchParams = useSearchParams()

//   useEffect(() => {
//     const handleVerification = async () => {
//       try {
//         const error = searchParams.get('error')
//         const errorCode = searchParams.get('error_code')
//         const errorDescription = searchParams.get('error_description')
//         const token = searchParams.get('token')
//         const type = searchParams.get('type')

//         if (error) {
//           setStatus('error')
//           if (errorCode === 'otp_expired') {
//             setMessage('This link has expired. Please request a new confirmation email.')
//           } else {
//             setMessage(errorDescription || 'Verification failed. Please try again.')
//           }
//           return
//         }

//         if (token && type) {
//           const result = await handleEmailConfirmation(token, type)
//           if (result.success) {
//             setStatus('success')
//             setMessage('Email confirmed! Redirecting to sign in...')
            
//             // Auto-redirect with countdown
//             const timer = setInterval(() => {
//               setCountdown((prev) => {
//                 if (prev <= 1) {
//                   clearInterval(timer)
//                   router.push('/auth/login')
//                   return 0
//                 }
//                 return prev - 1
//               })
//             }, 1000)
//           } else {
//             setStatus('error')
//             setMessage('Verification failed. Please try again.')
//           }
//         } else {
//           const { data: { session } } = await supabase.auth.getSession()
//           if (session?.user?.email_confirmed_at) {
//             setStatus('success')
//             setMessage('Your email is already verified!')
//           } else {
//             setStatus('error')
//             setMessage('Invalid or missing verification link.')
//           }
//         }
//       } catch (error) {
//         console.error('Verification error:', error)
//         setStatus('error')
//         setMessage('An unexpected error occurred. Please try again.')
//       }
//     }

//     handleVerification()
//   }, [searchParams, router])

//   // Loading Screen
//   if (status === 'loading') {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
//         <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-center shadow-2xl border border-white/20">
//           <Loader2 className="h-12 w-12 text-white animate-spin mx-auto mb-4" />
//           <h2 className="text-2xl font-black text-white mb-2">Verifying Email</h2>
//           <p className="text-gray-300">Please wait while we confirm your account...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 flex items-center justify-center p-4 relative overflow-hidden">
//       {/* Animated Background */}
//       <div className="absolute inset-0">
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
//       </div>

//       <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-0">
//         {/* Status Card */}
//         <div className="flex items-center justify-center p-6 lg:p-12">
//           <div className="w-full max-w-md">
//             <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
//               {status === 'success' ? (
//                 <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
//                   <CheckCircle className="h-12 w-12 text-white" />
//                 </div>
//               ) : (
//                 <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mb-6">
//                   <XCircle className="h-12 w-12 text-white" />
//                 </div>
//               )}

//               <h1 className="text-3xl font-black text-white mb-3">
//                 {status === 'success' ? "You're Verified!" : 'Verification Failed'}
//               </h1>

//               <p className="text-gray-300 mb-6">{message}</p>

//               {status === 'success' && (
//                 <div className="bg-white/10 rounded-2xl p-4 mb-6">
//                   <p className="text-sm text-gray-300 flex items-center justify-center gap-2">
//                     <Shield className="h-4 w-4 text-emerald-400" />
//                     Redirecting in <span className="text-emerald-400 font-bold">{countdown}s</span>
//                   </p>
//                 </div>
//               )}

//               <div className="space-y-3">
//                 <Link
//                   href="/auth/login"
//                   className="block w-full py-3 bg-white text-violet-600 font-bold rounded-xl hover:bg-gray-100 transition flex items-center justify-center gap-2"
//                 >
//                   Go to Sign In
//                   <ArrowRight className="h-5 w-5" />
//                 </Link>

//                 {status === 'error' && (
//                   <Link
//                     href="/auth/register"
//                     className="block w-full py-3 border border-white/30 text-white rounded-xl hover:bg-white/10 transition"
//                   >
//                     Create New Account
//                   </Link>
//                 )}
//               </div>

//               {status === 'error' && (
//                 <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl">
//                   <p className="text-sm text-red-200">
//                     Check your <span className="font-bold">spam folder</span> or{' '}
//                     <Link href="/auth/forgot-password" className="underline hover:text-white">
//                       request a new link
//                     </Link>
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Right Panel – Emotional + Trust */}
//         <div className="hidden lg:flex items-center justify-center p-12">
//           <div className="max-w-lg">
//             <h2 className="text-5xl font-black text-white mb-6 leading-tight">
//               {status === 'success' ? (
//                 <>
//                   Welcome to
//                   <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
//                     FormMirror
//                   </span>
//                 </>
//               ) : (
//                 <>
//                   Let’s Get You
//                   <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400">
//                     Verified
//                   </span>
//                 </>
//               )}
//             </h2>
//             <p className="text-xl text-gray-300 mb-10">
//               {status === 'success' ? (
//                 <>
//                   Your email is confirmed. You’re ready to track forms with <span className="text-emerald-400 font-bold">privacy-first analytics</span>.
//                 </>
//               ) : (
//                 <>
//                   Verification links are <span className="text-emerald-400 font-bold">secure & encrypted</span>. 
//                   They expire after 1 hour for your safety.
//                 </>
//               )}
//             </p>

//             <div className="space-y-6">
//               {status === 'success' ? (
//                 <>
//                   <div className="flex items-start gap-4">
//                     <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
//                       <CheckCircle className="h-7 w-7 text-white" />
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-bold text-white mb-1">Account Activated</h3>
//                       <p className="text-gray-300">Full access unlocked</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start gap-4">
//                     <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
//                       <Mail className="h-7 w-7 text-white" />
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-bold text-white mb-1">Secure & Private</h3>
//                       <p className="text-gray-300">No data shared</p>
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="flex items-start gap-4">
//                     <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
//                       <Shield className="h-7 w-7 text-white" />
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-bold text-white mb-1">Encrypted Link</h3>
//                       <p className="text-gray-300">End-to-end secure</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start gap-4">
//                     <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
//                       <Clock className="h-7 w-7 text-white" />
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-bold text-white mb-1">1-Hour Expiry</h3>
//                       <p className="text-gray-300">Auto-deletes for safety</p>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { supabase } from '@/lib/supabase/browser'
// import { handleEmailConfirmation } from '@/lib/users'
// import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react'
// import Link from 'next/link'

// export default function VerifyPage() {
//   const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
//   const [message, setMessage] = useState('')
//   const router = useRouter()
//   const searchParams = useSearchParams()

//   useEffect(() => {
//     const handleVerification = async () => {
//       try {
//         // Get URL parameters
//         const error = searchParams.get('error')
//         const errorCode = searchParams.get('error_code')
//         const errorDescription = searchParams.get('error_description')
//         const token = searchParams.get('token')
//         const type = searchParams.get('type')
        
//         console.log('🔍 Verification params:', { error, errorCode, errorDescription, token, type })

//         // Handle errors from Supabase
//         if (error) {
//           setStatus('error')
//           if (errorCode === 'otp_expired') {
//             setMessage('Email confirmation link has expired. Please request a new confirmation email.')
//           } else {
//             setMessage(errorDescription || 'Email confirmation failed. Please try again.')
//           }
//           return
//         }

//         // Handle successful verification
//         if (token && type) {
//           console.log('🔐 Processing verification token...')
//           const result = await handleEmailConfirmation(token, type)
          
//           if (result.success) {
//             setStatus('success')
//             setMessage('Email confirmed successfully! You can now sign in to your account.')
            
//             // Redirect to login after 3 seconds
//             setTimeout(() => {
//               router.push('/auth/login')
//             }, 3000)
//           } else {
//             setStatus('error')
//             setMessage('Email confirmation failed. Please try again or contact support.')
//           }
//         } else {
//           // No token, check if user is already confirmed
//           const { data: { session } } = await supabase.auth.getSession()
//           if (session?.user?.email_confirmed_at) {
//             setStatus('success')
//             setMessage('Your email is already confirmed! You can sign in to your account.')
//       } else {
//             setStatus('error')
//             setMessage('Invalid confirmation link. Please check your email or request a new confirmation.')
//           }
//         }
//       } catch (error) {
//         console.error('🚨 Verification error:', error)
//         setStatus('error')
//         setMessage('An unexpected error occurred. Please try again.')
//       }
//     }

//     handleVerification()
//   }, [searchParams, router])

//   if (status === 'loading') {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
//         <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4">
//           <div className="text-center">
//             <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
//             <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Email</h1>
//             <p className="text-gray-600">Please wait while we confirm your email address...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
//       <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4">
//         <div className="text-center">
//           {status === 'success' ? (
//             <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
//           ) : (
//             <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
//           )}
          
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">
//             {status === 'success' ? 'Email Confirmed!' : 'Verification Failed'}
//           </h1>
          
//           <p className="text-gray-600 mb-6">{message}</p>
          
//           <div className="space-y-3">
//             <Link
//               href="/auth/login"
//               className="block w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
//             >
//               Go to Sign In
//             </Link>
            
//             <Link
//               href="/auth/register"
//               className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
//             >
//               Create New Account
//           </Link>
//         </div>
          
//           {status === 'error' && (
//             <div className="mt-6 p-4 bg-red-50 rounded-xl">
//               <p className="text-sm text-red-600">
//                 If you continue to have issues, please check your spam folder or contact support.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// } 