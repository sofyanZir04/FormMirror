'use client'

import { useEffect, useState } from 'react'

export default function DemoPage() {
  const [projectId, setProjectId] = useState('')
  const [isTracking, setIsTracking] = useState(false)

  const startTracking = () => {
    if (!projectId) return

    const script = document.createElement('script')
    script.src = '/track.js'
    script.setAttribute('data-project-id', projectId)
    script.setAttribute('data-form-selector', '#demo-form')
    document.head.appendChild(script)
    setIsTracking(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Form submitted! Check your dashboard for tracking data.')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">FormMirror Demo</h1>
          
          {!isTracking ? (
            <div className="mb-6">
              <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your Project ID
              </label>
              <input
                type="text"
                id="projectId"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="Enter project ID from your dashboard"
                className="w-full"
              />
              <button
                onClick={startTracking}
                disabled={!projectId}
                className="mt-3 w-full btn-primary disabled:opacity-50"
              >
                Start Tracking
              </button>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                ✅ Tracking is active! Fill out the form below to see analytics in your dashboard.
              </p>
            </div>
          )}

          <form id="demo-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 w-full"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 w-full"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="mt-1 w-full"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="mt-1 w-full"
                placeholder="Enter your message"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select id="category" name="category" className="mt-1 w-full">
                <option value="">Select a category</option>
                <option value="general">General Inquiry</option>
                <option value="support">Support</option>
                <option value="sales">Sales</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="newsletter"
                name="newsletter"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-900">
                Subscribe to newsletter
              </label>
            </div>

            <button
              type="submit"
              className="w-full btn-primary"
            >
              Submit Form
            </button>
          </form>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-sm font-medium text-blue-900 mb-2">What's being tracked:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Field focus and blur events</li>
              <li>• Time spent on each field</li>
              <li>• Input and change events</li>
              <li>• Form submission</li>
              <li>• Form abandonment (if you leave without submitting)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 