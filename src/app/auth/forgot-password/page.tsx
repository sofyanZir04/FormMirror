'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle, Shield, Clock, ArrowRight } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Failed to send reset email')

      setSent(true)
      toast.success('Check your email!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  // Success Screen
  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-center shadow-2xl border border-white/20">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3">
            Check Your Email
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            We sent a secure reset link to <span className="text-emerald-400 font-semibold">{email}</span>
          </p>
          <div className="bg-white/10 rounded-2xl p-4 mb-6 space-y-3">
            <p className="text-sm text-gray-300 flex items-center justify-center gap-2">
              <Shield className="h-4 w-4 text-emerald-400" />
              Link encrypted & expires in 1 hour
            </p>
            <p className="text-sm text-gray-300">
              Click the link to <span className="text-emerald-400">reset your password instantly</span>
            </p>
          </div>
          <div className="space-y-3">
            <Link
              href="/auth/login"
              className="block w-full py-3 bg-white text-violet-600 font-bold rounded-xl hover:bg-gray-100 transition"
            >
              Back to Sign In
            </Link>
            <button
              onClick={() => setSent(false)}
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
                  <Shield className="h-9 w-9 text-white" />
                </div>
                <h1 className="text-3xl font-black text-white mb-2">
                  Forgot Password?
                </h1>
                <p className="text-gray-300">
                  Get back in 60 seconds — securely
                </p>
              </div>

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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl hover:from-violet-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/auth/login" className="inline-flex items-center text-violet-400 hover:text-violet-300 transition text-sm">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel – Emotional + Trust */}
        <div className="hidden lg:flex items-center justify-center p-12">
          <div className="max-w-lg">
            <h2 className="text-5xl font-black text-white mb-6 leading-tight">
              Get Back In
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                60 Seconds
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              We’ll send you a <span className="text-emerald-400 font-bold">secure, encrypted link</span> 
              to reset your password — <span className="text-white">no questions asked</span>.
            </p>

            <div className="space-y-6">
              {[
                { icon: Shield, title: "Military-Grade Encryption", desc: "Your reset link is fully encrypted" },
                { icon: Clock, title: "Expires in 1 Hour", desc: "Auto-deletes for security" },
                { icon: CheckCircle, title: "No Data Stored", desc: "We don’t log reset attempts" },
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
          </div>
        </div>
      </div>
    </div>
  )
}

// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'
// import Image from 'next/image'
// import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
// import { toast, Toaster } from 'react-hot-toast'

// export default function ForgotPasswordPage() {
//   const [email, setEmail] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [sent, setSent] = useState(false)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!email) {
//       toast.error('Please enter your email address')
//       return
//     }

//     setLoading(true)
//     try {
//       const response = await fetch('/api/auth/forgot-password', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to send reset email')
//       }

//       setSent(true)
//       toast.success(data.message || 'Password reset email sent!')
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : 'Failed to send reset email. Please try again.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (sent) {
//     return (
//       <div className="min-h-screen flex">
//         {/* Form Section */}
//         <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
//           <div className="w-full max-w-md">
//             {/* Logo */}
//             <div className="text-center mb-8">
//               <Link href="/" className="inline-flex items-center">
//                 <Image src="/logo.svg" alt="FormMirror logo" width={48} height={48} className="mr-4" />
//                 <span className="text-2xl font-bold text-gray-900">FormMirror</span>
//               </Link>
//             </div>

//             {/* Success Message */}
//             <div className="bg-white rounded-2xl shadow-xl p-8">
//               <div className="text-center">
//                 <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
//                   <CheckCircle className="h-8 w-8 text-green-600" />
//                 </div>
//                 <h1 className="text-3xl font-bold text-gray-900 mb-4">Check Your Email</h1>
//                 <p className="text-gray-600 mb-6">
//                   We&apos;ve sent a password reset link to <strong>{email}</strong>. 
//                   Click the link in the email to reset your password.
//                 </p>
//                 <div className="bg-blue-50 rounded-lg p-4 mb-6">
//                   <p className="text-sm text-blue-800">
//                     <strong>Didn&apos;t receive the email?</strong> Check your spam folder or 
//                     <button 
//                       onClick={() => setSent(false)}
//                       className="text-blue-600 hover:text-blue-700 ml-1 underline"
//                     >
//                       try again
//                     </button>
//                   </p>
//                 </div>
//                 <Link
//                   href="/auth/login"
//                   className="inline-flex items-center text-blue-600 hover:text-blue-700"
//                 >
//                   <ArrowLeft className="h-4 w-4 mr-2" />
//                   Back to Sign In
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Preview Section */}
//         <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 items-center justify-center p-12">
//           <div className="text-center text-white">
//             <h2 className="text-3xl font-bold mb-4">Reset Your Password</h2>
//             <p className="text-xl text-blue-100">
//               We&apos;ll help you get back to tracking your form analytics in no time.
//             </p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen flex">
//       {/* Form Section */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
//         <div className="w-full max-w-md">
//           {/* Logo */}
//           <div className="text-center mb-8">
//             <Link href="/" className="inline-flex items-center">
//               <Image src="/logo.svg" alt="FormMirror logo" width={48} height={48} className="mr-4" />
//               <span className="text-2xl font-bold text-gray-900">FormMirror</span>
//             </Link>
//           </div>

//           {/* Form */}
//           <div className="bg-white rounded-2xl shadow-xl p-8">
//             <div className="text-center mb-8">
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
//               <p className="text-gray-600">Enter your email to receive a password reset link</p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Mail className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     type="email"
//                     id="email"
//                     name="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     className="pl-10 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                     placeholder="Enter your email"
//                   />
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? 'Sending...' : 'Send Reset Link'}
//               </button>
//             </form>

//             <div className="mt-6 text-center">
//               <Link href="/auth/login" className="text-blue-600 hover:text-blue-500">
//                 <ArrowLeft className="h-4 w-4 inline mr-2" />
//                 Back to Sign In
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Preview Section */}
//       <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 items-center justify-center p-12">
//         <div className="text-center text-white">
//           <h2 className="text-3xl font-bold mb-4">Reset Your Password</h2>
//           <p className="text-xl text-blue-100">
//             We&apos;ll help you get back to tracking your form analytics in no time.
//           </p>
//         </div>
//       </div>

//       <Toaster position="top-right" />
//     </div>
//   )
// } 