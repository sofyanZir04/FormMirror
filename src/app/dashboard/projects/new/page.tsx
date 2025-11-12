'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import { Toaster, toast } from 'react-hot-toast'
import Link from 'next/link'
import { Plus, ArrowLeft, Code,MessageSquare
  ,BarChart3, CheckCircle, Shield, Zap, Copy, ExternalLink } from 'lucide-react'

export default function NewProjectPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    form_selector: 'form',
    website_url: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('You must be logged in')
      return
    }

    if (!form.name.trim()) {
      toast.error('Project name is required')
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: form.name.trim(),
          description: form.description.trim(),
          form_selector: form.form_selector.trim() || 'form',
          website_url: form.website_url.trim(),
          user_id: user.id
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Project created!')
      router.push(`/dashboard/projects/${data.id}`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  const copySnippet = () => {
    const snippet = `<script src="https://formmirror.com/track.js" data-project-id="YOUR_ID"></script>`
    navigator.clipboard.writeText(snippet)
    toast.success('Copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 text-white py-8">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1a1a1a', color: '#fff' } }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <Link href="/dashboard" className="inline-flex items-center text-violet-300 hover:text-white mb-6 text-sm">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center">
              <Plus className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black">Create New Project</h1>
              <p className="text-lg text-gray-300 mt-1">Start tracking forms in under 60 seconds</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <form onSubmit={handleSubmit} className="space-y-7">
                {/* Project Name */}
                <div>
                  <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                    Project Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Contact Form, Signup Flow"
                    className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold mb-2">Description (Optional)</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="What form are you tracking?"
                    className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none transition"
                  />
                </div>

                {/* Website URL */}
                <div>
                  <label className="block text-sm font-bold mb-2">Website URL</label>
                  <input
                    name="website_url"
                    type="url"
                    value={form.website_url}
                    onChange={handleChange}
                    placeholder="https://yoursite.com"
                    className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                  />
                </div>

                {/* Form Selector */}
                <div>
                  <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                    Form Selector <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="form_selector"
                    type="text"
                    required
                    value={form.form_selector}
                    onChange={handleChange}
                    placeholder="form, .contact-form, #signup"
                    className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition font-mono"
                  />
                  <p className="mt-2 text-xs text-gray-400">
                    CSS selector to target your form. Default: <code className="bg-white/10 px-2 py-1 rounded">form</code>
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 rounded-xl hover:from-emerald-400 hover:to-teal-500 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>Creating...</>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      Create Project
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* What You'll Get */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
              <h3 className="text-lg font-black mb-4 flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-emerald-400" />
                What You Get
              </h3>
              <ul className="space-y-3 text-sm text-gray-300">
                {[
                  'Real-time form analytics',
                  'Drop-off heatmaps',
                  'No cookies, no PII',
                  'GDPR & CCPA compliant',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Setup */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
              <h3 className="text-lg font-black mb-4 flex items-center gap-3">
                <Code className="h-6 w-6 text-violet-400" />
                60-Second Setup
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                After creation, paste this snippet into your <code className="bg-white/10 px-1 rounded">&lt;head&gt;</code>:
              </p>
              <div className="bg-black/30 rounded-xl p-4 font-mono text-xs text-gray-200 relative group">
                {`<script src="https://formmirror.com/track.js" data-project-id="YOUR_ID"></script>`}
                <button
                  onClick={copySnippet}
                  className="absolute top-2 right-2 p-1.5 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-gradient-to-r from-violet-600/20 to-indigo-600/20 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
              <h3 className="text-lg font-black mb-3">Need Help?</h3>
              <p className="text-sm text-gray-300 mb-4">
                We’re here 24/7. Docs, chat, or email.
              </p>
              <div className="flex gap-2">
                <Link
                  href="/help"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 rounded-xl text-sm font-bold hover:bg-white/20 transition"
                >
                  <ExternalLink className="h-4 w-4" />
                  Docs
                </Link>
                <Link
                  href="/dashboard/feedback"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl text-sm font-bold hover:from-emerald-400 hover:to-teal-500 transition"
                >
                  <MessageSquare className="h-4 w-4" />
                  Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
