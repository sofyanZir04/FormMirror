'use client'

import { FormEvent, useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { Mail, Lock, AlertCircle, Loader2, Shield, BarChart3, Zap, ArrowRight, Sparkles, CheckCircle} from 'lucide-react'
import { supabase } from '@/lib/supabase/browser'
import { toast } from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { signIn, signInWithGoogle } = useAuth()

  useEffect(() => setMounted(true), [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      })

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link. Check spam if needed.')
        } else if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.')
        } else {
          setError(error.message)
        }
        return
      }

      if (user) {
        // Ensure plan & profile
        const ensureRecords = async () => {
          const { data: plan } = await supabase.from('user_plans').select('*').eq('user_id', user.id).single()
          if (!plan) {
            await supabase.from('user_plans').insert({
              user_id: user.id,
              plan_type: 'free',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
          }

          const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
          if (!profile) {
            await supabase.from('profiles').insert({
              id: user.id,
              email: user.email!,
              full_name: user.user_metadata?.full_name || 'User',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
          }
        }

        await ensureRecords().catch(console.error)
        toast.success('Welcome back!')
        window.location.href = '/dashboard'
      }
    } catch (err: any) {
      setError(err.message || 'Login failed')
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

  return (
    <div suppressHydrationWarning className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div suppressHydrationWarning className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Form Card */}
        <div className="flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                  <Sparkles className="h-9 w-9 text-white" />
                </div>
                <h1 className="text-3xl font-black text-white mb-2">
                  Welcome Back
                </h1>
                <p className="text-gray-300">
                  Sign in to track forms with privacy-first analytics
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

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center text-gray-300">
                    <input type="checkbox" className="mr-2 rounded border-white/30 text-violet-600 focus:ring-violet-500" />
                    Remember me
                  </label>
                  <Link href="/auth/forgot-password" className="text-violet-400 hover:text-violet-300 transition">
                    Forgot password?
                  </Link>
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
                      Sign In
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
                Don’t have an account?{' '}
                <Link href="/auth/register" className="font-bold text-white hover:text-violet-300 transition">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel – Emotional + Technical */}
        <div className="hidden lg:flex items-center justify-center p-12">
          <div className="max-w-lg">
            <h2 className="text-5xl font-black text-white mb-6 leading-tight">
              Welcome Back to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                40% More Conversions
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Your forms are already winning. 
              <span className="text-emerald-400 font-bold"> FormMirror</span> shows you 
              <span className="text-white"> exactly where to improve</span> — 
              without tracking users.
            </p>

            <div className="space-y-6">
              {[
                { icon: Shield, title: "Privacy-First by Design", desc: "No cookies, no PII, GDPR-ready" },
                { icon: BarChart3, title: "Live Drop-Off Heatmap", desc: "See abandons in real-time" },
                { icon: Zap, title: "40% Avg. Conversion Lift", desc: "Backed by 10,000+ forms" },
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
                <span>No credit card needed</span>
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
// import { Mail, Lock, BarChart3, Shield, Zap, AlertCircle, Loader2 } from 'lucide-react'
// import { supabase } from '@/lib/supabase/browser'
// import { toast } from 'react-hot-toast'

// export default function LoginPage() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const { signIn, signInWithGoogle } = useAuth()
//   const router = useRouter()

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault()
//     setError('')
//     setIsLoading(true)
    
//     try {
//       // First check if user exists and email is confirmed
//       const { data: { user }, error: userError } = await supabase.auth.signInWithPassword({
//         email: email.trim(),
//         password: password
//       })

//       if (userError) {
//         console.error('❌ Supabase login failed:', userError.message)
        
//         // Check if it's an email confirmation error
//         if (userError.message.includes('Email not confirmed') || userError.message.includes('not confirmed')) {
//           setError('Please check your email and click the confirmation link before signing in. If you haven\'t received the email, check your spam folder.')
//         } else if (userError.message.includes('Invalid login credentials')) {
//           setError('Invalid email or password. Please check your credentials and try again.')
//         } else {
//           setError(userError.message || 'Invalid email or password')
//         }
//         return
//       }

//       if (user) {
//         console.log('✅ Supabase login successful:', user.email)
        
//         // Check if user plan exists, if not create one
//         try {
//           const { data: existingPlan } = await supabase
//             .from('user_plans')
//             .select('*')
//             .eq('user_id', user.id)
//             .single()

//           if (!existingPlan) {
//             console.log('⚠️ No user plan found, creating default plan...')
//             const { error: planError } = await supabase
//               .from('user_plans')
//               .insert({
//                 user_id: user.id,
//                 plan_type: 'free',
//                 created_at: new Date().toISOString(),
//                 updated_at: new Date().toISOString()
//               })

//             if (planError) {
//               console.error('⚠️ Failed to create user plan record:', planError)
//             } else {
//               console.log('✅ Default user plan created successfully')
//             }
//           }
//         } catch (planError) {
//           console.error('⚠️ Error checking/creating user plan:', planError)
//         }

//         // Check if profile exists, if not create one
//         try {
//           const { data: existingProfile } = await supabase
//             .from('profiles')
//             .select('*')
//             .eq('id', user.id)
//             .single()

//           if (!existingProfile) {
//             console.log('⚠️ No profile found, creating default profile...')
//             const { error: profileError } = await supabase
//               .from('profiles')
//               .insert({
//                 id: user.id,
//                 email: user.email!,
//                 full_name: user.user_metadata?.full_name || 'User',
//                 created_at: new Date().toISOString(),
//                 updated_at: new Date().toISOString()
//               })

//             if (profileError) {
//               console.error('⚠️ Failed to create profile record:', profileError)
//             } else {
//               console.log('✅ Default profile created successfully')
//             }
//           }
//         } catch (profileError) {
//           console.error('⚠️ Error checking/creating profile:', profileError)
//         }

//         toast.success('Login successful!')
//         router.push('/dashboard')
//       }
//     } catch (error: any) {
//       console.error('🚨 Login error:', error)
//       setError(error.message || 'Invalid email or password')
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

//   return (
//     <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//       {/* Form Section */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative">
//         {/* Animated background elements */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
//           <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-indigo-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
//         </div>
        
//         <div className="w-full max-w-md relative z-10">
//           {/* Logo */}
//           <div className="text-center mb-8 transform transition-all duration-700 hover:scale-105">
//             <Link href="/" className="inline-flex items-center group">
//               <div className="relative">
//                 <Image src="/logo.svg" alt="FormMirror logo" width={48} height={48} className="mr-4 transition-transform duration-300 group-hover:rotate-3" />
//                 <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
//               </div>
//               <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">FormMirror</span>
//             </Link>
//           </div>

//           {/* Form */}
//           <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 transform transition-all duration-700 hover:shadow-3xl hover:scale-[1.02]">
//             <div className="text-center mb-8">
//               <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2 animate-fade-in">Welcome back</h1>
//               <p className="text-gray-600 animate-fade-in delay-100">Sign in to your account to continue</p>
//             </div>

//             {error && (
//               <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/50 rounded-xl flex items-center backdrop-blur-sm animate-shake">
//                 <AlertCircle className="h-5 w-5 text-red-500 mr-2 animate-pulse" />
//                 <span className="text-red-700 font-medium">{error}</span>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="group">
//                 <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500">
//                     <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
//                   </div>
//                   <input
//                     type="email"
//                     id="email"
//                     name="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     disabled={isLoading}
//                     className="pl-12 block w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-50/50 focus:bg-white hover:bg-white shadow-sm hover:shadow-md focus:shadow-lg transform hover:scale-[1.01] focus:scale-[1.01]"
//                     placeholder="Enter your email"
//                   />
//                 </div>
//               </div>

//               <div className="group">
//                 <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500">
//                     <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
//                   </div>
//                   <input
//                     type="password"
//                     id="password"
//                     name="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     disabled={isLoading}
//                     className="pl-12 block w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-50/50 focus:bg-white hover:bg-white shadow-sm hover:shadow-md focus:shadow-lg transform hover:scale-[1.01] focus:scale-[1.01]"
//                     placeholder="Enter your password"
//                   />
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <input
//                     id="remember-me"
//                     name="remember-me"
//                     type="checkbox"
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                   />
//                   <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
//                     Remember me
//                   </label>
//                 </div>

//                 <div className="text-sm">
//                   <Link
//                     href="/auth/forgot-password"
//                     className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
//                   >
//                     Forgot your password?
//                   </Link>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-2xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] relative overflow-hidden group"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
//                 <div className="relative z-10 flex items-center">
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
//                       <span className="animate-pulse">Signing in...</span>
//                     </>
//                   ) : (
//                     <>
//                       <span>Sign in</span>
//                       <div className="ml-2 transform transition-transform group-hover:translate-x-1">→</div>
//                     </>
//                   )}
//                 </div>
//               </button>

//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300" />
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-2 bg-white text-gray-500">Or continue with</span>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 onClick={handleGoogleSignIn}
//                 className="w-full inline-flex justify-center items-center py-4 px-6 border border-gray-200 rounded-2xl shadow-md bg-white text-base font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200/50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] group relative overflow-hidden"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-blue-50 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
//                 <div className="relative z-10 flex items-center">
//                   <svg className="w-6 h-6 mr-3 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
//                     <path
//                       fill="#4285F4"
//                       d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                     />
//                     <path
//                       fill="#34A853"
//                       d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                     />
//                     <path
//                       fill="#FBBC05"
//                       d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                     />
//                     <path
//                       fill="#EA4335"
//                       d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                     />
//                   </svg>
//                   <span>Continue with Google</span>
//                 </div>
//               </button>
//             </form>

//             <div className="mt-6">
//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300" />
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
//                 </div>
//               </div>

//               <div className="mt-6 text-center">
//                 <Link
//                   href="/auth/register"
//                   className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
//                 >
//                   Create your account
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Preview Section */}
//       <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden">
//         <div className="absolute inset-0 bg-black/30"></div>
        
//         {/* Animated background elements */}
//         <div className="absolute inset-0">
//           <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
//           <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-float-delayed"></div>
//           <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-400/20 rounded-full blur-lg animate-pulse"></div>
//           <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-purple-400/15 rounded-full blur-lg animate-float-slow"></div>
//         </div>
        
//         <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
//           <div className="max-w-md text-center">
//             <div className="mb-8 relative">
//               <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
//               <BarChart3 className="relative mx-auto h-28 w-28 text-blue-200 animate-float" />
//             </div>
            
//             <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-fade-in">
//               Privacy-First Form Analytics
//             </h2>
            
//             <p className="text-xl text-blue-100 mb-8 leading-relaxed animate-fade-in delay-200">
//               Track user behavior on your forms without compromising privacy. 
//               Get insights that matter while respecting user data.
//             </p>
            
//             <div className="space-y-6">
//               <div className="flex items-center text-blue-100 group hover:text-white transition-colors duration-300 animate-fade-in delay-300">
//                 <div className="relative mr-4">
//                   <Shield className="h-6 w-6 text-blue-300 group-hover:text-blue-200 transition-colors duration-300" />
//                   <div className="absolute -inset-1 bg-blue-400/20 rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
//                 </div>
//                 <span className="font-medium">GDPR & CCPA Compliant</span>
//               </div>
              
//               <div className="flex items-center text-blue-100 group hover:text-white transition-colors duration-300 animate-fade-in delay-400">
//                 <div className="relative mr-4">
//                   <Zap className="h-6 w-6 text-blue-300 group-hover:text-yellow-300 transition-colors duration-300" />
//                   <div className="absolute -inset-1 bg-yellow-400/20 rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
//                 </div>
//                 <span className="font-medium">Real-time Analytics</span>
//               </div>
              
//               <div className="flex items-center text-blue-100 group hover:text-white transition-colors duration-300 animate-fade-in delay-500">
//                 <div className="relative mr-4">
//                   <Lock className="h-6 w-6 text-blue-300 group-hover:text-green-300 transition-colors duration-300" />
//                   <div className="absolute -inset-1 bg-green-400/20 rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
//                 </div>
//                 <span className="font-medium">End-to-End Encryption</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }