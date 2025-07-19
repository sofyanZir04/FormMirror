'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import { Toaster, toast } from 'react-hot-toast'
import Link from 'next/link'
import { Plus, ArrowLeft, Settings, Code, BarChart3 } from 'lucide-react'

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
      toast.error('You must be logged in to create a project')
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            name: form.name,
            description: form.description,
            form_selector: form.form_selector,
            website_url: form.website_url,
            user_id: user.id
          }
        ])
        .select()
        .single()

      if (error) throw error

      toast.success('Project created successfully!')
      router.push(`/dashboard/projects/${data.id}`)
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'message' in error) {
        toast.error((error as { message: string }).message)
      } else {
        toast.error('Failed to create project')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <Plus className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Create New Project</h1>
              <p className="text-lg text-gray-600 mt-1">Set up form tracking for your website</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Project Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-200"
                    placeholder="My Contact Form"
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    className="block w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-200 resize-none"
                    placeholder="Track user behavior on our main contact form"
                  />
                </div>

                {/* Website URL */}
                <div>
                  <label htmlFor="website_url" className="block text-sm font-semibold text-gray-700 mb-2">
                    Website URL
                  </label>
                  <input
                    id="website_url"
                    name="website_url"
                    type="url"
                    value={form.website_url}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-200"
                    placeholder="https://example.com"
                  />
                </div>

                {/* Form Selector */}
                <div>
                  <label htmlFor="form_selector" className="block text-sm font-semibold text-gray-700 mb-2">
                    Form Selector *
                  </label>
                  <input
                    id="form_selector"
                    name="form_selector"
                    type="text"
                    required
                    value={form.form_selector}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-200"
                    placeholder="form, .contact-form, #signup-form"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    CSS selector to identify your form. Default is &quot;form&quot; for all forms.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? 'Creating Project...' : 'Create Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* What You'll Get */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                What You&apos;ll Get
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Real-time form analytics</span>
                </li>
                <li className="flex items-start">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>User behavior insights</span>
                </li>
                <li className="flex items-start">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Privacy-friendly tracking</span>
                </li>
                <li className="flex items-start">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>No cookies required</span>
                </li>
              </ul>
            </div>

            {/* Quick Setup */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Code className="h-5 w-5 mr-2 text-green-600" />
                Quick Setup
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                After creating your project, you&apos;ll get a tracking snippet to add to your website.
              </p>
              <div className="bg-gray-50 rounded-lg p-3 text-xs font-mono text-gray-700">
                &lt;script src=&quot;/track.js&quot; data-project-id=&quot;...&quot;&gt;&lt;/script&gt;
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Check out our documentation or contact support for assistance.
              </p>
              <Link
                href="/dashboard/feedback"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Get Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 