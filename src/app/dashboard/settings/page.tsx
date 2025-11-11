'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase/browser'
import Link from 'next/link'
import { ArrowLeft, Save, User, Mail, Calendar, Shield, CheckCircle } from 'lucide-react'

export default function SettingsPage() {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
  })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // SAFELY load user data
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
        email: user.email || '',
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setSuccess('')
    setError('')

    try {
      // Update Supabase profile
      const { error: dbError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.full_name.trim(),
          updated_at: new Date().toISOString(),
        })

      if (dbError) throw dbError

      // Update auth metadata (optional)
      if (updateUser) {
        await updateUser({ full_name: formData.full_name.trim() })
      }

      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
      setTimeout(() => setError(''), 3000)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string) => {
    if (!name) return ''
    return name
      .trim()
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : 'Unknown'

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center text-violet-300 hover:text-white mb-8 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Sidebar */}
            <div className="md:col-span-1 bg-gradient-to-br from-violet-600 to-indigo-600 p-8 text-white flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl">
                {formData.full_name ? (
                  <span className="text-3xl font-black text-violet-600">
                    {getInitials(formData.full_name)}
                  </span>
                ) : (
                  <User className="h-12 w-12 text-violet-400" />
                )}
              </div>

              <h3 className="text-xl font-black mb-1">{formData.full_name || 'Set Your Name'}</h3>
              <p className="text-sm opacity-90 mb-4">{formData.email}</p>

              <div className="flex items-center gap-2 text-xs opacity-80">
                <Calendar className="h-3.5 w-3.5" />
                Member since {memberSince}
              </div>

              <div className="mt-6 w-full">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold">
                    <Shield className="h-4 w-4" />
                    Secure Account
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-2 p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-black text-white mb-2">Account Settings</h2>
                <p className="text-gray-300">Keep your profile up to date</p>
              </div>

              {/* Alerts */}
              {success && (
                <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-xl flex items-center gap-3 text-emerald-400">
                  <CheckCircle className="h-5 w-5" />
                  {success}
                </div>
              )}
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-400">
                  <X className="h-5 w-5" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-7">
                {/* Email (Read-only) */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-3">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-gray-400 cursor-not-allowed"
                    />
                    <p className="mt-2 text-xs text-gray-400">
                      Contact support to change email.
                    </p>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-3">
                    <User className="h-4 w-4" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                  />
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3.5 px-8 rounded-xl hover:from-emerald-400 hover:to-teal-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center gap-3"
                  >
                    {loading ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Account Info */}
              <div className="mt-10 pt-8 border-t border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Account Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">User ID</p>
                    <p className="font-mono text-xs text-gray-300 break-all">{user.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Provider</p>
                    <p className="text-gray-300 capitalize">{user.app_metadata?.provider || 'email'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 'use client'

// import { useState, useEffect } from 'react'
// import { useAuth } from '@/contexts/AuthContext'
// import { supabase } from '@/lib/supabase/browser'
// import Link from 'next/link'
// import { ArrowLeft, Save, User2 } from 'lucide-react'

// export default function SettingsPage() {
//   const { user } = useAuth()
//   const [loading, setLoading] = useState(false)
//   const [formData, setFormData] = useState({
//     full_name: '',
//     email: '',
//   })
//   const [success, setSuccess] = useState('')
//   const [error, setError] = useState('')

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         full_name: user.email?.split('@')[0] || '',
//         email: user.email || '',
//       })
//     }
//   }, [user])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!user) return
//     setLoading(true)
//     setSuccess('')
//     setError('')
//     try {
//       const { error } = await supabase
//         .from('profiles')
//         .update({
//           full_name: formData.full_name,
//           updated_at: new Date().toISOString(),
//         })
//         .eq('id', user.id)
//       if (error) throw error
//       setSuccess('Profile updated successfully!')
//     } catch {
//       setError('Failed to update profile')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Helper for avatar initials
//   const getInitials = (name: string) => {
//     if (!name) return ''
//     return name
//       .split(' ')
//       .map((n) => n[0])
//       .join('')
//       .toUpperCase()
//   }

//   return (
//     <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
//       <div className="mb-4 sm:mb-6">
//         <Link
//           href="/dashboard"
//           className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
//         >
//           <ArrowLeft className="h-4 w-4 mr-1" />
//           Back to Dashboard
//         </Link>
//       </div>
//       <div className="bg-white shadow-xl rounded-2xl flex flex-col md:flex-row overflow-hidden">
//         {/* Profile Sidebar */}
//         <div className="md:w-1/3 bg-gradient-to-b from-blue-600 to-blue-500 text-white flex flex-col items-center justify-center p-6 sm:p-8">
//           <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center mb-4 shadow-lg">
//             {formData.full_name ? (
//               <span className="text-xl sm:text-2xl font-bold text-blue-600">{getInitials(formData.full_name)}</span>
//             ) : (
//               <User2 className="h-8 w-8 sm:h-10 sm:w-10 text-blue-400" />
//             )}
//           </div>
//           <div className="text-base sm:text-lg font-semibold mb-1 truncate w-full text-center">{formData.full_name || 'Your Name'}</div>
//           <div className="text-xs sm:text-sm opacity-80 mb-2 truncate w-full text-center">{formData.email}</div>
//           <div className="mt-4">
//             <span className="inline-block bg-white/20 rounded-full px-2 sm:px-3 py-1 text-xs font-medium border border-white/30">
//               Member since{' '}
//               {user?.id ? new Date().toLocaleDateString() : 'N/A'}
//             </span>
//           </div>
//         </div>
//         {/* Settings Form */}
//         <div className="md:w-2/3 p-6 sm:p-8">
//           <div className="mb-6 border-b pb-4">
//             <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Account Settings</h2>
//             <p className="mt-1 text-sm text-gray-500">
//               Update your profile information and preferences.
//             </p>
//           </div>
//           {/* Feedback Alerts */}
//           {success && (
//             <div className="mb-4 p-3 rounded-md bg-green-50 border border-green-200 text-green-800 text-sm">
//               {success}
//             </div>
//           )}
//           {error && (
//             <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm">
//               {error}
//             </div>
//           )}
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="relative">
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email Address
//               </label>
//               <span className="absolute left-3 top-7 text-gray-400 pointer-events-none">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v1a4 4 0 01-8 0v-1" /></svg>
//               </span>
//               <input
//                 type="email"
//                 id="email"
//                 value={formData.email}
//                 disabled
//                 className="mt-1 pl-10 block w-full bg-gray-100 text-gray-400 border-2 border-gray-200 rounded-xl shadow-sm text-sm sm:text-base cursor-not-allowed transition-all duration-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 py-2 sm:py-3"
//               />
//               <p className="mt-1 text-xs text-gray-400">
//                 Email address cannot be changed. Contact support if needed.
//               </p>
//             </div>
//             <div className="relative">
//               <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
//                 Full Name
//               </label>
//               <span className="absolute left-3 top-9 text-gray-400 pointer-events-none">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
//               </span>
//               <input
//                 type="text"
//                 id="full_name"
//                 value={formData.full_name}
//                 onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
//                 className="mt-1 pl-10 block w-full border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-sm sm:text-base py-2 sm:py-3 transition-all duration-200"
//                 placeholder="Enter your full name"
//               />
//             </div>
//             <div className="flex justify-end">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="btn-primary bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl py-2 sm:py-3 px-4 sm:px-6 flex items-center gap-2 text-sm sm:text-base"
//               >
//                 <Save className="h-4 w-4" />
//                 {loading ? 'Saving...' : 'Save Changes'}
//               </button>
//             </div>
//           </form>
//           {/* <div className="mt-10 pt-6 border-t border-gray-100">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
//             <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
//               <div>
//                 <dt className="text-sm font-medium text-gray-500">User ID</dt>
//                 <dd className="mt-1 text-sm text-gray-900 font-mono break-all">{user?.id}</dd>
//               </div>
//               <div>
//                 <dt className="text-sm font-medium text-gray-500">Member Since</dt>
//                 <dd className="mt-1 text-sm text-gray-900">
//                   {user?.id ? new Date().toLocaleDateString() : 'N/A'}
//                 </dd>
//               </div>
//             </dl>
//           </div> */}
//         </div>
//       </div>
//     </div>
//   )
// } 