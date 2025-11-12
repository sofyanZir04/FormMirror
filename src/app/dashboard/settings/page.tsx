// pages/SettingsPage.tsx
// pages/SettingsPage.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase/browser'
import Link from 'next/link'
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Calendar,
  Shield,
  CheckCircle,
  X,
} from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
  })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  /* ────── Load user data safely ────── */
  useEffect(() => {
    if (!user) return

    const fallbackName = user.email?.split('@')[0] ?? ''
    setFormData({
      full_name: user.full_name ?? fallbackName,
      email: user.email ?? '',
    })
  }, [user])

  /* ────── Submit handler (writes only to profiles table) ────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setSuccess('')
    setError('')

    try {
      const { error: dbError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.full_name.trim(),
          updated_at: new Date().toISOString(),
        })

      if (dbError) throw dbError

      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message ?? 'Failed to update profile')
      setTimeout(() => setError(''), 3000)
    } finally {
      setLoading(false)
    }
  }

  /* ────── Helper: initials ────── */
  const getInitials = (name: string) => {
    if (!name) return ''
    return name
      .trim()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  /* ────── Member‑since (fallback to now) ────── */
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      })
    : 'Unknown'

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
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

              <h3 className="text-xl font-black mb-1">
                {formData.full_name || 'Set Your Name'}
              </h3>
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
                <h2 className="text-3xl font-black text-white mb-2">
                  Account Settings
                </h2>
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
                {/* Email (read‑only) */}
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
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    placeholder="Your full name"
                    className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                  />
                </div>

                {/* Save */}
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

              {/* Account Details */}
              <div className="mt-10 pt-8 border-t border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">
                  Account Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">User ID</p>
                    <p className="font-mono text-xs text-gray-300 break-all">
                      {user.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Provider</p>
                    <p className="text-gray-300 capitalize">
                      {user.provider ?? 'email'}
                    </p>
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
// import { ArrowLeft, Save, User, Mail, Calendar, Shield, CheckCircle, X } from 'lucide-react'

// export default function SettingsPage() {
//   const { user } = useAuth() // Removed updateUser
//   const [loading, setLoading] = useState(false)
//   const [formData, setFormData] = useState({
//     full_name: '',
//     email: '',
//   })
//   const [success, setSuccess] = useState('')
//   const [error, setError] = useState('')

//   // SAFELY load user data
//   useEffect(() => {
//     if (user) {
//       const fullName = user.full_name || '';
//       setFormData({
//         full_name: fullName || user.email?.split('@')[0] || '',
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
//       // Update Supabase profile
//       const { error: dbError } = await supabase
//         .from('profiles')
//         .upsert({
//           id: user.id,
//           full_name: formData.full_name.trim(),
//           updated_at: new Date().toISOString(),
//         })

//       if (dbError) throw dbError

//       // Note: We're not updating auth metadata since updateUser doesn't exist in context
//       // Only profile table is updated

//       setSuccess('Profile updated successfully!')
//       setTimeout(() => setSuccess(''), 3000)
//     } catch (err: any) {
//       setError(err.message || 'Failed to update profile')
//       setTimeout(() => setError(''), 3000)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getInitials = (name: string) => {
//     if (!name) return ''
//     return name
//       .trim()
//       .split(' ')
//       .map(n => n[0])
//       .join('')
//       .toUpperCase()
//       .slice(0, 2)
//   }

//   const memberSince = user?.created_at
//     ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
//     : 'Unknown'

//   if (!user) return null

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 py-12">
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Back Link */}
//         <Link
//           href="/dashboard"
//           className="inline-flex items-center text-violet-300 hover:text-white mb-8 text-sm font-medium"
//         >
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Back to Dashboard
//         </Link>

//         <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
//           <div className="grid grid-cols-1 md:grid-cols-3">
//             {/* Sidebar */}
//             <div className="md:col-span-1 bg-gradient-to-br from-violet-600 to-indigo-600 p-8 text-white flex flex-col items-center text-center">
//               <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl">
//                 {formData.full_name ? (
//                   <span className="text-3xl font-black text-violet-600">
//                     {getInitials(formData.full_name)}
//                   </span>
//                 ) : (
//                   <User className="h-12 w-12 text-violet-400" />
//                 )}
//               </div>

//               <h3 className="text-xl font-black mb-1">{formData.full_name || 'Set Your Name'}</h3>
//               <p className="text-sm opacity-90 mb-4">{formData.email}</p>

//               <div className="flex items-center gap-2 text-xs opacity-80">
//                 <Calendar className="h-3.5 w-3.5" />
//                 Member since {memberSince}
//               </div>

//               <div className="mt-6 w-full">
//                 <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
//                   <div className="flex items-center justify-center gap-2 text-xs font-bold">
//                     <Shield className="h-4 w-4" />
//                     Secure Account
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Form */}
//             <div className="md:col-span-2 p-8">
//               <div className="mb-8">
//                 <h2 className="text-3xl font-black text-white mb-2">Account Settings</h2>
//                 <p className="text-gray-300">Keep your profile up to date</p>
//               </div>

//               {/* Alerts */}
//               {success && (
//                 <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-xl flex items-center gap-3 text-emerald-400">
//                   <CheckCircle className="h-5 w-5" />
//                   {success}
//                 </div>
//               )}
//               {error && (
//                 <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-400">
//                   <X className="h-5 w-5" />
//                   {error}
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-7">
//                 {/* Email (Read-only) */}
//                 <div>
//                   <label className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-3">
//                     <Mail className="h-4 w-4" />
//                     Email Address
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="email"
//                       value={formData.email}
//                       disabled
//                       className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-gray-400 cursor-not-allowed"
//                     />
//                     <p className="mt-2 text-xs text-gray-400">
//                       Contact support to change email.
//                     </p>
//                   </div>
//                 </div>

//                 {/* Full Name */}
//                 <div>
//                   <label className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-3">
//                     <User className="h-4 w-4" />
//                     Full Name
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.full_name}
//                     onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
//                     placeholder="Your full name"
//                     className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
//                   />
//                 </div>

//                 {/* Save Button */}
//                 <div className="flex justify-end">
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3.5 px-8 rounded-xl hover:from-emerald-400 hover:to-teal-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center gap-3"
//                   >
//                     {loading ? (
//                       <>Saving...</>
//                     ) : (
//                       <>
//                         <Save className="h-5 w-5" />
//                         Save Changes
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>

//               {/* Account Info */}
//               <div className="mt-10 pt-8 border-t border-white/10">
//                 <h3 className="text-lg font-bold text-white mb-4">Account Details</h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
//                   <div>
//                     <p className="text-gray-400">User ID</p>
//                     <p className="font-mono text-xs text-gray-300 break-all">{user.id}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-400">Provider</p>
//                     <p className="text-gray-300 capitalize">{user.app_metadata?.provider || 'email'}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
