'use client'

import { FormEvent, useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { Mail, Lock, User, AlertCircle, Loader2, CheckCircle, Shield, BarChart3, Zap, ArrowRight, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase/browser'
import { toast } from 'react-hot-toast'
import { ensureUserPlan, ensureUserProfile } from '@/lib/users'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { signInWithGoogle } = useAuth()

  useEffect(() => setMounted(true), [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: name, plan: 'free' },
          emailRedirectTo: `${window.location.origin}/auth/verify`
        }
      })

      if (error) throw error

      if (data.user) {
        await ensureUserPlan(data.user.id, 'free')
        await ensureUserProfile(data.user.id, data.user.email!, name)
        setIsSuccess(true)
        toast.success('Check your email to verify!')
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    try {
      await signInWithGoogle()
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed')
    }
  }

  // Success Screen
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-center shadow-2xl border border-white/20">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3">
            You're Almost There!
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            We sent a magic link to <span className="text-emerald-400 font-semibold">{email}</span>
          </p>
          <div className="bg-white/10 rounded-2xl p-4 mb-6">
            <p className="text-sm text-gray-300">
              Click the link in your email to verify and <span className="text-emerald-400">start tracking forms instantly</span>.
            </p>
          </div>
          <div className="space-y-3">
            <Link
              href="/auth/login"
              className="block w-full py-3 bg-white text-violet-600 font-bold rounded-xl hover:bg-gray-100 transition"
            >
              Go to Sign In
            </Link>
            <button
              onClick={() => setIsSuccess(false)}
              className="block w-full py-3 border border-white/30 text-white rounded-xl hover:bg-white/10 transition"
            >
              Try Another Email
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Form Card */}
        <div className="flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                  <Sparkles className="h-9 w-9 text-white" />
                </div>
                <h1 className="text-3xl font-black text-white mb-2">
                  Start Free Trial
                </h1>
                <p className="text-gray-300">
                  No credit card • 30 seconds • Instant access
                </p>
              </div>

              {error && (
                <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-2xl p-4 flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl hover:from-violet-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-transparent text-gray-400">Or</span>
                  </div>
                </div>

                <button
                  onClick={handleGoogle}
                  disabled={isLoading}
                  className="mt-4 w-full py-3.5 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 transition flex items-center justify-center gap-3"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>
              </div>

              <p className="mt-6 text-center text-sm text-gray-400">
                Already have an account?{' '}
                <Link href="/auth/login" className="font-bold text-white hover:text-violet-300 transition">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel – Emotional + Technical */}
        <div className="hidden lg:flex items-center justify-center p-12">
          <div className="max-w-lg">
            <h2 className="text-5xl font-black text-white mb-6 leading-tight">
              You’re Losing
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400">
                70% of Leads
              </span>
              in Silence
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Most form tools <span className="line-through text-gray-500">track users</span>. 
              FormMirror tracks <span className="text-emerald-400 font-bold">form behavior</span> — 
              without invading privacy.
            </p>

            <div className="space-y-6">
              {[
                { icon: Shield, title: "100% Privacy-First", desc: "No cookies, no PII, GDPR-ready" },
                { icon: BarChart3, title: "Real-Time Drop-Offs", desc: "See where users abandon instantly" },
                { icon: Zap, title: "40% Conversion Lift", desc: "Proven with 10,000+ forms" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-gray-300">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 'use client'

// import { FormEvent, useState } from 'react'
// import { useAuth } from '@/contexts/AuthContext'
// import Link from 'next/link'
// import Image from 'next/image'
// import { useRouter } from 'next/navigation'
// import { Mail, Lock, User, BarChart3, Shield, Zap, AlertCircle, Loader2, CheckCircle } from 'lucide-react'
// import { supabase } from '@/lib/supabase/browser'
// import { toast } from 'react-hot-toast'
// import { ensureUserPlan, ensureUserProfile } from '@/lib/users'

// export default function RegisterPage() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [name, setName] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState('')
//   const [isSuccess, setIsSuccess] = useState(false)
//   const { signInWithGoogle } = useAuth()
//   const router = useRouter()

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault()
//     setError('')
//     setIsLoading(true)
    
//     try {
//       console.log('🔐 Supabase register attempt:', { email: email.trim(), name })
      
//       const { data, error } = await supabase.auth.signUp({
//         email: email.trim(),
//         password: password,
//         options: {
//           data: {
//             full_name: name,
//             plan: 'free'
//           },
//           emailRedirectTo: `${window.location.origin}/auth/verify`
//         }
//       })

//       if (error) {
//         console.error('❌ Supabase registration failed:', error.message)
//         setError(error.message)
//         return
//       }

//       if (data.user) {
//         console.log('✅ Supabase registration successful:', data.user.email)
        
//         // Create user plan and profile using utility functions
//         try {
//           const userPlan = await ensureUserPlan(data.user.id, 'free')
//           const userProfile = await ensureUserProfile(data.user.id, data.user.email!, name)
          
//           if (userPlan) {
//             console.log('✅ User plan record created successfully')
//           } else {
//             console.log('⚠️ Failed to create user plan record')
//           }
          
//           if (userProfile) {
//             console.log('✅ Profile record created successfully')
//           } else {
//             console.log('⚠️ Failed to create profile record')
//           }
//         } catch (error) {
//           console.error('⚠️ Error creating user records:', error)
//           // Don't fail registration if record creation fails
//         }

//         setIsSuccess(true)
//         toast.success('Account created successfully! Please check your email to verify your account.')
//       }
//     } catch (error: any) {
//       console.error('🚨 Registration error:', error)
//       setError(error.message || 'Registration failed')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleGoogleSignIn = async () => {
//     try {
//       setError('')
//       await signInWithGoogle()
//       console.log('Google sign-in successful')
//       // Redirect will happen automatically after OAuth flow
//     } catch (error: any) {
//       setError(error.message || 'Failed to sign in with Google')
//     }
//   }

//   if (isSuccess) {
//     return (
//       <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-emerald-50 to-green-100">
//         <div className="w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
//           <div className="max-w-md w-full space-y-8 text-center">
//             <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
//               <CheckCircle className="h-8 w-8 text-green-600" />
//             </div>
//             <div>
//               <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
//                 Check Your Email!
//               </h2>
//               <p className="mt-2 text-sm text-gray-600">
//                 We've sent a confirmation link to <strong>{email}</strong>
//               </p>
//               <p className="mt-2 text-sm text-gray-600">
//                 Click the link in your email to complete your registration and start using FormMirror.
//               </p>
//             </div>
//             <div className="space-y-3">
//               <Link
//                 href="/auth/login"
//                 className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//               >
//                 Go to Sign In
//               </Link>
//               <button
//                 onClick={() => setIsSuccess(false)}
//                 className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//               >
//                 Create Another Account
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-emerald-50 to-green-100">
//       {/* Form Section */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative">
//         {/* Animated background elements */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl animate-pulse"></div>
//           <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-green-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
//         </div>

//         <div className="max-w-md w-full space-y-8 relative z-10">
//           <div className="text-center">
//             <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
//               <Image
//                 src="/logo.svg"
//                 alt="FormMirror Logo"
//                 width={32}
//                 height={32}
//                 className="h-8 w-8"
//               />
//             </div>
//             <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
//               Create your account
//             </h2>
//             <p className="mt-2 text-sm text-gray-600">
//               Start tracking form analytics with privacy-first approach
//             </p>
//           </div>

//           <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//             {error && (
//               <div className="bg-red-50 border border-red-200 rounded-xl p-4">
//                 <div className="flex">
//                   <AlertCircle className="h-5 w-5 text-red-400" />
//                   <div className="ml-3">
//                     <p className="text-sm text-red-800">{error}</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="space-y-4">
//               <div>
//                 <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                   Full Name
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <User className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     id="name"
//                     name="name"
//                     type="text"
//                     required
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                     placeholder="Enter your full name"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                   Email address
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Mail className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     autoComplete="email"
//                     required
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                     placeholder="Enter your email"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     id="password"
//                     name="password"
//                     type="password"
//                     autoComplete="new-password"
//                     required
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                     placeholder="Create a password"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//               >
//                 {isLoading ? (
//                   <Loader2 className="h-5 w-5 animate-spin" />
//                 ) : (
//                   'Create Account'
//                 )}
//               </button>
//             </div>

//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300" />
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white text-gray-500">Or continue with</span>
//               </div>
//             </div>

//             <div>
//               <button
//                 type="button"
//                 onClick={handleGoogleSignIn}
//                 disabled={isLoading}
//                 className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                   <path
//                     fill="#4285F4"
//                     d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                   />
//                   <path
//                     fill="#34A853"
//                     d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                   />
//                   <path
//                     fill="#FBBC05"
//                     d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                   />
//                   <path
//                     fill="#EA4335"
//                     d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                   />
//                 </svg>
//                 Sign up with Google
//               </button>
//             </div>

//             <div className="text-center">
//               <p className="text-sm text-gray-600">
//                 Already have an account?{' '}
//                 <Link
//                   href="/auth/login"
//                   className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
//                 >
//                   Sign in here
//                 </Link>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* Features Section */}
//       <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 relative overflow-hidden">
//         <div className="absolute inset-0 bg-black/20"></div>
//         <div className="relative z-10 flex flex-col justify-center px-8 py-12 text-white">
//           <div className="max-w-lg">
//             <h1 className="text-4xl font-bold mb-6">
//               Track form analytics with{' '}
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">
//                 privacy-first
//               </span>{' '}
//               approach
//             </h1>
//             <p className="text-xl text-blue-100 mb-8">
//               Understand user behavior without compromising privacy. Get insights into form performance, 
//               conversion rates, and user experience.
//             </p>
            
//             <div className="space-y-6">
//               <div className="flex items-start space-x-4">
//                 <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
//                   <Shield className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold mb-2">Privacy-First Analytics</h3>
//                   <p className="text-blue-100">No personal data collection, GDPR compliant, user privacy respected</p>
//                 </div>
//               </div>
              
//               <div className="flex items-start space-x-4">
//                 <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
//                   <BarChart3 className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold mb-2">Real-Time Insights</h3>
//                   <p className="text-blue-100">Monitor form performance, conversion rates, and user behavior in real-time</p>
//                 </div>
//               </div>
              
//               <div className="flex items-start space-x-4">
//                 <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
//                   <Zap className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold mb-2">Easy Integration</h3>
//                   <p className="text-blue-100">Simple setup, works with any form, no code changes required</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }