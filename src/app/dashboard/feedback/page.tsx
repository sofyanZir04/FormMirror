'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import { Toaster, toast } from 'react-hot-toast'
import Link from 'next/link'
import { MessageSquare, Send, CheckCircle, User, Mail, Sparkles, ArrowLeft, X } from 'lucide-react'

export default function FeedbackPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
    type: 'feedback' // feedback, bug, feature
  })

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
        email: user.email || ''
      }))
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please log in to submit feedback')
      return
    }

    if (!form.message.trim()) {
      toast.error('Please write a message')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('feedback')
        .insert({
          user_id: user.id,
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          type: form.type,
          status: 'new'
        })

      if (error) throw error

      toast.success('Thank you! We’ve received your feedback.')
      setSubmitted(true)
      setForm(prev => ({ ...prev, message: '' }))
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSubmitted(false)
    setForm(prev => ({ ...prev, message: '' }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 text-white py-12">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1a1a1a', color: '#fff' } }} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/dashboard" className="inline-flex items-center text-violet-300 hover:text-white mb-6 text-sm">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Link>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-6 shadow-xl">
            <MessageSquare className="h-9 w-9 text-white" />
          </div>
          <h1 className="text-5xl font-black mb-4">
            We’d <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Love to Hear</span> from You
          </h1>
          <p className="text-xl text-gray-300 max-w-xl mx-auto">
            Every idea, bug, or compliment helps us build a better FormMirror.
          </p>
        </div>

        {/* Success State */}
        {submitted ? (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 text-center border border-white/20">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-black mb-4">Thank You!</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-md mx-auto">
              Your feedback is now in our system. We review every submission and usually reply within 24 hours.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={resetForm}
                className="px-8 py-3 bg-white text-violet-600 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
              >
                Submit Another
              </button>
              <Link
                href="/dashboard"
                className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl font-bold hover:bg-white/20 transition"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 space-y-8">
            {/* Type Selector */}
            <div>
              <label className="block text-sm font-bold mb-3">What kind of feedback?</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'feedback', label: 'Idea', icon: Sparkles },
                  { value: 'bug', label: 'Bug', icon: X },
                  { value: 'feature', label: 'Feature', icon: MessageSquare },
                ].map((type) => (
                  <label
                    key={type.value}
                    className={`flex flex-col items-center p-4 rounded-2xl cursor-pointer transition-all ${
                      form.type === type.value
                        ? 'bg-white/20 border-2 border-emerald-400'
                        : 'bg-white/5 border-2 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={form.type === type.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <type.icon className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-bold mb-3 flex items-center gap-2">
                <User className="h-4 w-4" /> Your Name
              </label>
              <input
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="How should we call you?"
                className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold mb-3 flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email (Optional)
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="We’ll reply here if needed"
                className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-bold mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Your Message
              </label>
              <textarea
                name="message"
                required
                value={form.message}
                onChange={handleChange}
                rows={6}
                placeholder="Be as detailed as you’d like..."
                className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none transition"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 rounded-xl hover:from-emerald-400 hover:to-teal-500 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center justify-center gap-3"
            >
              {loading ? (
                <>Sending...</>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Send Feedback
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400">
              We reply within <span className="font-bold text-emerald-400">24 hours</span>. For urgent issues,{' '}
              <Link href="/help" className="underline hover:text-emerald-400">
                see docs
              </Link>{' '}
              or email <span className="font-mono">support@formmirror.com</span>.
            </p>
          </form>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400">
          <p className="text-sm">
            Your input shapes FormMirror.{' '}
            <span role="img" aria-label="heart">Thank you!</span>
          </p>
        </div>
      </div>
    </div>
  )
}

// 'use client';

// import { useState } from 'react';
// import { MessageSquare, Send, CheckCircle, User, Mail } from 'lucide-react';

// export default function FeedbackPage() {
//   const [submitted, setSubmitted] = useState(false);
//   const [form, setForm] = useState({ name: '', email: '', message: '' });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitted(true);
//     // Here you would send the feedback to your backend or email
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 py-8 sm:py-16">
//       <div className="max-w-2xl mx-auto px-4 sm:px-6">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
//             <MessageSquare className="h-8 w-8 text-white" />
//           </div>
//           <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
//             Share Your Feedback
//           </h1>
//           <p className="text-lg text-gray-600 max-w-md mx-auto">
//             Help us improve FormMirror by sharing your thoughts, suggestions, or reporting any issues.
//           </p>
//         </div>

//         {/* Main Content */}
//         <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
//           {submitted ? (
//             <div className="p-8 sm:p-12 text-center">
//               <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
//                 <CheckCircle className="h-10 w-10 text-green-600" />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
//               <p className="text-gray-600 mb-6">
//                 Your feedback has been submitted successfully. We&apos;ll review it and get back to you soon.
//               </p>
//               <button
//                 onClick={() => setSubmitted(false)}
//                 className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//               >
//                 Submit Another
//               </button>
//             </div>
//           ) : (
//             <form className="p-8 sm:p-12 space-y-8" onSubmit={handleSubmit}>
//               {/* Name Field */}
//               <div className="relative">
//                 <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
//                   Your Name
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                     <User className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     id="name"
//                     name="name"
//                     type="text"
//                     required
//                     value={form.name}
//                     onChange={handleChange}
//                     className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-200 bg-gray-50 focus:bg-white"
//                     placeholder="Enter your full name"
//                   />
//                 </div>
//               </div>

//               {/* Email Field */}
//               <div className="relative">
//                 <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
//                   Email Address <span className="text-gray-400 font-normal">(optional)</span>
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                     <Mail className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     value={form.email}
//                     onChange={handleChange}
//                     className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-200 bg-gray-50 focus:bg-white"
//                     placeholder="you@example.com"
//                   />
//                 </div>
//               </div>

//               {/* Message Field */}
//               <div className="relative">
//                 <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-3">
//                   Your Feedback
//                 </label>
//                 <div className="relative">
//                   <div className="absolute top-4 left-4 flex items-start pointer-events-none">
//                     <MessageSquare className="h-5 w-5 text-gray-400 mt-0.5" />
//                   </div>
//                   <textarea
//                     id="message"
//                     name="message"
//                     required
//                     value={form.message}
//                     onChange={handleChange}
//                     className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
//                     rows={6}
//                     placeholder="Share your thoughts, suggestions, or report any issues..."
//                   />
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <div className="pt-4">
//                 <button
//                   type="submit"
//                   className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
//                 >
//                   <Send className="h-5 w-5" />
//                   Submit Feedback
//                 </button>
//               </div>

//               {/* Additional Info */}
//               <div className="text-center pt-6 border-t border-gray-100">
//                 <p className="text-sm text-gray-500">
//                   We typically respond within 24 hours. For urgent issues, please contact us directly.
//                 </p>
//               </div>
//             </form>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="text-center mt-8">
//           <p className="text-sm text-gray-500">
//             Your feedback helps us make FormMirror better for everyone. Thank you! 🙏
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// } 