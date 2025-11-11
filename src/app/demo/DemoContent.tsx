'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ArrowRight, BarChart3, Eye, MousePointer, Zap, Shield, CheckCircle, ArrowLeft } from 'lucide-react'

export default function DemoContent() {
  const [stats, setStats] = useState({ views: 1247, interactions: 892, conversion: 23.4 })
  const [activity, setActivity] = useState<string[]>([])
  const [isTracking, setIsTracking] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        views: prev.views + Math.floor(Math.random() * 3),
        interactions: prev.interactions + Math.floor(Math.random() * 2),
        conversion: Math.max(0, Math.min(100, prev.conversion + (Math.random() - 0.5) * 0.8))
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const logActivity = (event: string) => {
    setActivity(prev => [`${event}`, ...prev.slice(0, 4)])
  }

  useEffect(() => {
    logActivity('Page loaded')
    setIsTracking(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 text-white">
      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                <span className="text-white font-black text-lg">FM</span>
              </div>
              <span className="text-xl font-bold">FormMirror</span>
            </Link> */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
                <img 
                  src="/logo.svg" 
                  alt="FormMirror Logo" 
                  className="w-full h-full"
                />
              </div>
              <span className="text-xl font-bold text-white">FormMirror</span>
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <Link href="/video-demo" className="text-gray-300 hover:text-white transition">Video Demo</Link>
              <Link href="/help" className="text-gray-300 hover:text-white transition">Help</Link>
              <Link href="/auth/login" className="text-gray-300 hover:text-white transition">Sign In</Link>
              <Link
                href="/auth/register"
                className="bg-white text-violet-600 px-5 py-2 rounded-xl font-bold hover:bg-gray-100 transition"
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-black mb-6">
            See FormMirror
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
              In Action
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Fill out the form. Watch analytics update <span className="text-emerald-400">in real-time</span>. No cookies. No tracking.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400" /> No Personal Data
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-400" /> GDPR Compliant
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-400" /> Real-Time
            </div>
          </div>
        </div>
      </section>

      {/* Demo Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                <Zap className="h-7 w-7 text-emerald-400" />
                Try It Live
              </h2>
              <p className="text-gray-300 mb-8">
                Fill out any field. Watch the dashboard update instantly.
              </p>

              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault()
                  logActivity('Form submitted')
                }}
              >
                {[
                  { label: "Full Name", type: "text", placeholder: "John Doe" },
                  { label: "Email", type: "email", placeholder: "john@example.com" },
                  { label: "Company", type: "text", placeholder: "Acme Inc." },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-sm font-medium mb-2">{field.label}</label>
                    <input
                      type={field.type}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                      placeholder={field.placeholder}
                      onFocus={() => logActivity(`Focused on ${field.label.toLowerCase()} field`)}
                      onBlur={() => logActivity(`Left ${field.label.toLowerCase()} field`)}
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition resize-none"
                    placeholder="Tell us about your project..."
                    onFocus={() => logActivity('Focused on message field')}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 rounded-xl hover:from-emerald-400 hover:to-teal-500 transition-all transform hover:scale-[1.02] shadow-xl"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Live Analytics */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                <BarChart3 className="h-7 w-7 text-violet-400" />
                Live Dashboard
              </h2>
              <p className="text-gray-300 mb-8">
                This is what you’ll see in your real dashboard.
              </p>

              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Eye className="h-5 w-5 text-blue-400" />
                      <span className="text-sm text-gray-300">Views</span>
                    </div>
                    <p className="text-3xl font-black">{stats.views.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <MousePointer className="h-5 w-5 text-emerald-400" />
                      <span className="text-sm text-gray-300">Interactions</span>
                    </div>
                    <p className="text-3xl font-black">{stats.interactions.toLocaleString()}</p>
                  </div>
                </div>

                {/* Activity Feed */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <h3 className="font-bold text-sm mb-3">Recent Activity</h3>
                  <div className="space-y-2">
                    {activity.length > 0 ? (
                      activity.map((act, i) => (
                        <div key={i} className="flex items-center text-sm text-gray-300">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse"></div>
                          <span>{act}</span>
                          <span className="text-gray-500 ml-auto text-xs">now</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">Start interacting to see events</p>
                    )}
                  </div>
                </div>

                {/* Conversion */}
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Conversion Rate</p>
                      <p className="text-3xl font-black">{stats.conversion.toFixed(1)}%</p>
                    </div>
                    <BarChart3 className="h-10 w-10 opacity-80" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <h3 className="text-3xl font-black mb-4">Ready to Track Your Forms?</h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Start free. No credit card. No cookies. Just real insights.
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center bg-white text-violet-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Start Free Trial
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}