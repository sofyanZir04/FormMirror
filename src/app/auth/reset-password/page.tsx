'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Lock, Eye, EyeOff, CheckCircle, Shield, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react'
import { toast } from 'react-hot-toast'

function ResetPasswordContent() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => setMounted(true), [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      toast.error('Invalid reset link')
      return
    }

    if (password.length < 8) {
      toast.error('Password must be 8+ characters')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords don’t match')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to reset password')

      setSuccess(true)
      toast.success('Password reset!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  // Success Screen
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-center shadow-2xl border border-white/20">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3">
            Password Reset!
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            Your account is now <span className="text-emerald-400 font-bold">secure</span>
          </p>
          <div className="bg-white/10 rounded-2xl p-4 mb-6">
            <p className="text-sm text-gray-300">
              You can now <span className="text-emerald-400">sign in with your new password</span>
            </p>
          </div>
          <Link
            href="/auth/login"
            className="block w-full py-3 bg-white text-violet-600 font-bold rounded-xl hover:bg-gray-100 transition flex items-center justify-center gap-2"
          >
            Sign In Now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    )
  }

  // Invalid Token Screen
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-center shadow-2xl border border-white/20">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3">
            Invalid Link
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            This reset link is <span className="text-red-400">expired or invalid</span>
          </p>
          <Link
            href="/auth/forgot-password"
            className="block w-full py-3 bg-white text-violet-600 font-bold rounded-xl hover:bg-gray-100 transition"
          >
            Request New Link
          </Link>
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
                  <Lock className="h-9 w-9 text-white" />
                </div>
                <h1 className="text-3xl font-black text-white mb-2">
                  Set New Password
                </h1>
                <p className="text-gray-300">
                  Choose a strong, unique password
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">Minimum 8 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
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
                      Resetting...
                    </div>
                  ) : (
                    <>
                      Reset Password
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

        {/* Right Panel – Emotional + Security */}
        <div className="hidden lg:flex items-center justify-center p-12">
          <div className="max-w-lg">
            <h2 className="text-5xl font-black text-white mb-6 leading-tight">
              Your Account Is
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                Now Secure
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              A strong password is your first line of defense. 
              <span className="text-emerald-400 font-bold"> FormMirror</span> never sees it.
            </p>

            <div className="space-y-6">
              {[
                { icon: Shield, title: "End-to-End Encrypted", desc: "Your new password is never stored in plain text" },
                { icon: Lock, title: "Strong Password Required", desc: "8+ characters, case-sensitive" },
                { icon: CheckCircle, title: "Instant Access", desc: "Sign in immediately after reset" },
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

// Loading Fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg font-medium">Loading...</p>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordContent />
    </Suspense>
  )
}

// 'use client'

// import { useState, Suspense } from 'react'
// import { useSearchParams } from 'next/navigation'
// import Link from 'next/link'
// import Image from 'next/image'
// import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react'
// import { toast, Toaster } from 'react-hot-toast'

// function ResetPasswordContent() {
//   const [password, setPassword] = useState('')
//   const [confirmPassword, setConfirmPassword] = useState('')
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [success, setSuccess] = useState(false)
//   const searchParams = useSearchParams()
//   const token = searchParams.get('token')

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     if (!token) {
//       toast.error('Invalid reset link')
//       return
//     }

//     if (password.length < 8) {
//       toast.error('Password must be at least 8 characters long')
//       return
//     }

//     if (password !== confirmPassword) {
//       toast.error('Passwords do not match')
//       return
//     }

//     setLoading(true)
//     try {
//       const response = await fetch('/api/auth/reset-password', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ token, password }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to reset password')
//       }

//       setSuccess(true)
//       toast.success(data.message || 'Password reset successfully!')
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : 'Failed to reset password. Please try again.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (success) {
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
//                 <h1 className="text-3xl font-bold text-gray-900 mb-4">Password Reset!</h1>
//                 <p className="text-gray-600 mb-6">
//                   Your password has been successfully reset. You can now sign in with your new password.
//                 </p>
//                 <Link
//                   href="/auth/login"
//                   className="inline-flex items-center w-full justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Sign In
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Preview Section */}
//         <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-blue-600 items-center justify-center p-12">
//           <div className="text-center text-white">
//             <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
//             <p className="text-xl text-green-100">
//               Your password has been updated. Ready to continue tracking your form analytics?
//             </p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (!token) {
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

//             {/* Error Message */}
//             <div className="bg-white rounded-2xl shadow-xl p-8">
//               <div className="text-center">
//                 <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
//                   <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                   </svg>
//                 </div>
//                 <h1 className="text-3xl font-bold text-gray-900 mb-4">Invalid Reset Link</h1>
//                 <p className="text-gray-600 mb-6">
//                   This password reset link is invalid or has expired. Please request a new one.
//                 </p>
//                 <Link
//                   href="/auth/forgot-password"
//                   className="inline-flex items-center w-full justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Request New Reset Link
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Preview Section */}
//         <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-600 to-pink-600 items-center justify-center p-12">
//           <div className="text-center text-white">
//             <h2 className="text-3xl font-bold mb-4">Link Expired</h2>
//             <p className="text-xl text-red-100">
//               Password reset links expire for security. Request a new one to continue.
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
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Your Password</h1>
//               <p className="text-gray-600">Enter your new password below</p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                   New Password
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     id="password"
//                     name="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     className="pl-10 pr-10 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                     placeholder="Enter new password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-5 w-5 text-gray-400" />
//                     ) : (
//                       <Eye className="h-5 w-5 text-gray-400" />
//                     )}
//                   </button>
//                 </div>
//                 <p className="mt-1 text-sm text-gray-500">Must be at least 8 characters long</p>
//               </div>

//               <div>
//                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
//                   Confirm New Password
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     type={showConfirmPassword ? 'text' : 'password'}
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     required
//                     className="pl-10 pr-10 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                     placeholder="Confirm new password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   >
//                     {showConfirmPassword ? (
//                       <EyeOff className="h-5 w-5 text-gray-400" />
//                     ) : (
//                       <Eye className="h-5 w-5 text-gray-400" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? 'Resetting...' : 'Reset Password'}
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
//           <h2 className="text-3xl font-bold mb-4">Set New Password</h2>
//           <p className="text-xl text-blue-100">
//             Choose a strong password to keep your account secure.
//           </p>
//         </div>
//       </div>

//       <Toaster position="top-right" />
//     </div>
//   )
// }

// function LoadingFallback() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Loading...</h2>
//           <p className="mt-2 text-sm text-gray-600">
//             Please wait while we load the password reset page.
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function ResetPasswordPage() {
//   return (
//     <Suspense fallback={<LoadingFallback />}>
//       <ResetPasswordContent />
//     </Suspense>
//   )
// } 