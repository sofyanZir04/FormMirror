'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

export default function TestTrackingPage() {
  const [projectId, setProjectId] = useState('test-project-123')
  const [isTracking, setIsTracking] = useState(false)

  useEffect(() => {
    // Check if tracking script is loaded
    const checkTracking = () => {
      const script = document.querySelector('script[data-project-id]')
      if (script) {
        setIsTracking(true)
        console.log('✅ Tracking script found:', script)
      } else {
        setIsTracking(false)
        console.log('❌ Tracking script not found')
      }
    }

    checkTracking()
    // Check again after a short delay
    setTimeout(checkTracking, 1000)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            FormMirror Tracking Test
          </h1>
          
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              Tracking Status
            </h2>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm">
                {isTracking ? 'Tracking Active' : 'Tracking Not Active'}
              </span>
            </div>
            <p className="text-sm text-blue-700 mt-2">
              Project ID: {projectId}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project ID (for testing):
            </label>
            <input
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter project ID"
            />
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                name="message"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your message"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                <option value="general">General</option>
                <option value="support">Support</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit Form
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Instructions:
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Open browser console (F12) to see tracking logs</li>
              <li>• Fill out the form fields to trigger tracking events</li>
              <li>• Submit the form to see submit events</li>
              <li>• Close the page to see abandon events</li>
              <li>• Check your server logs for API calls</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tracking Script */}
      <Script
        src="/track.js"
        data-project-id={projectId}
        data-form-selector="form"
        strategy="afterInteractive"
      />
    </div>
  )
} 