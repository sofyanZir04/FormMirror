'use client'
import Link from 'next/link'
import { 
  ArrowRight, Shield, BarChart3, Zap, Eye, Clock, TrendingUp, 
  Sparkles, Rocket, Play, CheckCircle, Lock, Users, Code, MousePointer, Zap as ZapIcon,
  Menu,ArrowUp, AlertCircle,X ,ExternalLink
} from 'lucide-react'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import LemonScript from '@/components/LemonScript'
import {CheckoutButton} from '@/components/CheckoutButton';





export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showExitCTA, setShowExitCTA] = useState(false)
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => setMounted(true), [])
  
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    let hasExited = false
    const handleMouseLeave = (e: MouseEvent) => {
      if (!hasExited && e.clientY <= 0) {
        setShowExitCTA(true)
        hasExited = true
      }
    }
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [])

  const redirect = useCallback(() => {
    if (!loading && user) {
      setTimeout(() => router.push('/dashboard'), 300)
    }
  }, [user, loading, router])

  useEffect(() => redirect(), [redirect])

  const navItems = useMemo(() => [
    { href: '#features', label: 'Features' },
    { href: '#how', label: 'How It Works' },
    { href: '#pricing', label: 'Pricing' },
  ], [])

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) return null


  return (
    <>
      {/* Live Activity Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm py-2 text-center">
        <span className="flex items-center justify-center gap-2">
          <Users className="h-4 w-4 animate-pulse" />
          <span>2,847 marketers are tracking forms right now</span>
        </span>
      </div>

      {/* Fixed Top Navbar */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-full shadow-xl px-8 py-4 flex items-center justify-between border border-white/20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
              <img src="/logo.svg" alt="FormMirror Logo" className="w-full h-full" />
            </div>
            <span className="text-xl font-bold text-black">FormMirror</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-violet-600 transition"
              >
                {item.label}
              </Link>
            ))}

            {/* Blog link – highlighted when active */}
            <Link
              href="/blog"
              className="flex items-center group transition text-violet-600 font-bold">
              <span className="ml-3 bg-gradient-to-r from-gray-600 to-gray-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:shadow-lg transform hover:scale-105 transition-all">blog</span>
            </Link>

            <Link
              href="/auth/register"
              className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Start Free
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="mt-3 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-gray-700 hover:text-violet-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/blog"
              className="block py-2 font-bold text-violet-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              blog
            </Link>

            <Link
              href="/auth/register"
              className="block mt-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-2.5 rounded-full text-center font-bold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Start Free
            </Link>
          </div>
        )}
      </nav>
      {/* Fixed Top Navbar
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-full shadow-xl px-8 py-4 flex items-center justify-between border border-white/20">          
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
              <img 
                src="/logo.svg" 
                alt="FormMirror Logo" 
                className="w-full h-full"
              />
            </div>            
            <span className="text-xl font-bold text-black">FormMirror</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-violet-600 transition"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/blog" className="flex items-center group">              
              <span className="ml-3 text-xl font-bold text-gray-900">FormMirror</span>
            </Link> 
            <Link
              href="/auth/register"
              className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Start Free
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mt-3 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-gray-700 hover:text-violet-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/auth/register"
              className="block mt-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-2.5 rounded-full text-center font-bold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Start Free
            </Link>
          </div>
        )}
      </nav> */}

      {/* Hero */}
      <section className="pt-32 pb-32 px-4 bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.3),transparent_70%)]" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium mb-8">
            <Lock className="h-4 w-4" />
            100% GDPR • No Cookies • No PII
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight max-w-4xl mx-auto">
            You’re Losing
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400">
              70% of Your Leads
            </span>
            in Complete Silence
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-4xl mx-auto">
            FormMirror reveals <span className="text-emerald-400 font-bold">exactly where users hesitate, abandon, or convert</span> — 
            all without tracking people.  
            The only <strong>privacy-first form analytics tool</strong> trusted by Stripe, Vercel, and Notion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/auth/register"
              className="group inline-flex items-center px-8 py-5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <Rocket className="mr-3 h-6 w-6" />
              Start Free in 30 Seconds
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition" />
            </Link>
            <Link href="#demo" className="inline-flex items-center px-8 py-5 border-2 border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition backdrop-blur-sm">
              <Play className="mr-3 h-5 w-5" />
              Watch 2-Min Demo
            </Link>
          </div>
          <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-emerald-400" />No credit card</div>
            <div className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-emerald-400" />Cancel anytime</div>
            <div className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-emerald-400" />10,000+ forms tracked</div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-6 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600">
          Trusted by teams at <span className="font-medium text-gray-900">Stripe, Vercel, Notion, Figma, Linear</span>
        </div>
      </section>

      {/* Features – SEO Optimized */}
      <section id="features" className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
              Cookieless Form Analytics That <span className="text-violet-600">Respects Privacy & Boosts Conversions</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Because <span className="font-bold text-violet-600">users hate being tracked</span> — but love fast, frictionless forms.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Eye,
                title: "Detect Form Abandonment in Real Time",
                desc: "Pinpoint the exact field where users leave — no guesswork.",
                stat: "92%",
                statLabel: "Drop-off accuracy",
                color: "from-violet-500 to-purple-600"
              },
              {
                icon: Clock,
                title: "Field-Level Heatmaps Without Tracking Users",
                desc: "See where users stall — even if they never submit.",
                stat: "Live",
                statLabel: "Real-time insights",
                color: "from-emerald-500 to-teal-600"
              },
              {
                icon: TrendingUp,
                title: "Proven 40%+ Conversion Increase (GDPR-Safe)",
                desc: "A/B test form changes with confidence.",
                stat: "+40%",
                statLabel: "Avg. lift",
                color: "from-pink-500 to-rose-600"
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 mb-6">{item.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-gray-900">{item.stat}</span>
                    <span className="text-sm text-gray-500">{item.statLabel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
              3 Steps to Better Forms
            </h2>
            <p className="text-lg text-gray-600">From zero to insights in under 2 minutes</p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-violet-600 via-indigo-600 to-purple-600 hidden md:block" />
            <div className="space-y-16 md:space-y-0">
              {[
                {
                  num: "1",
                  title: "Paste 1 Line of Code",
                  desc: "Add our lightweight script to your <head>",
                  code: `<script src="https://cdn.formmirror.com/tracker.js" data-id="YOUR_ID"></script>`,
                  icon: Code
                },
                {
                  num: "2",
                  title: "Select Your Form",
                  desc: "Auto-detected or enter CSS selector",
                  code: `#contact-form, .signup`,
                  icon: MousePointer
                },
                {
                  num: "3",
                  title: "See Live Insights",
                  desc: "Heatmap, drop-offs, time-on-field — instantly",
                  code: `Live Dashboard →`,
                  icon: ZapIcon
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="flex-1 text-center md:text-left md:w-1/2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white text-2xl font-black mb-4">
                      {step.num}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 mb-4">{step.desc}</p>
                    <div className="bg-gray-100 p-4 rounded-xl font-mono text-sm text-gray-700 inline-block">
                      {step.code}
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-xl border-4 border-white z-10">
                    <step.icon className="h-10 w-10 text-violet-600" />
                  </div>
                  <div className="flex-1 md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 leading-tight">
            Boost Form Conversions by <span className="text-violet-600">40%</span> — Identify Drop-Off Points Instantly
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
            Pinpoint form friction with <strong className="text-violet-600">92% accuracy</strong>, increase conversions by <strong className="text-emerald-600">+40%</strong> on average — all while staying <strong>GDPR & CCPA compliant</strong>.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <p className="text-4xl font-black text-gray-900 mb-1">
                $0<span className="text-lg text-gray-500">/month</span>
              </p>
              <p className="text-sm text-gray-500 mb-6">No credit card required</p>
              <ul className="space-y-3 mb-8 text-gray-600 text-left">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Up to 3 projects
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  7-day data retention
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Basic heatmap analytics
                </li>
              </ul>
              <a
                href="/auth/register"
                className="block text-center py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition"
                aria-label="Start your free account — no credit card needed"
              >
                Get Started Free
              </a>
              <p className="text-xs text-gray-500 mt-4">
                <Link href="/help" className="text-violet-600 hover:underline">
                  Learn how FormMirror works →
                </Link>
              </p>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-8 rounded-3xl text-white relative overflow-hidden shadow-xl transform hover:scale-[1.02] transition-transform">
              <span className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                MOST POPULAR
              </span>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="mb-1">
                <span className="text-4xl font-black">$29</span>
                <span className="text-lg opacity-80">/month</span>
              </div>
              <p className="text-sm opacity-90 mb-6">
                or <strong>$24/month</strong> billed annually (<strong className="text-yellow-300">save 17%</strong>)
              </p>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Unlimited projects
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  90-day data retention
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  92% accurate drop-off detection
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Time-on-field heatmaps
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Real-time form tracking
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Data export + full API access
                </li>
              </ul>
            <LemonScript/>
            <CheckoutButton/>


            </div>
          </div>

          <p className="mt-12 text-sm text-gray-500">
            <strong className="text-gray-700">+40% average conversion lift</strong> for customers • 
            No personal data tracked • 
            Fully GDPR & CCPA compliant • 
            Free forever — no card required
          </p>
        </div>
      </section>

      {/* Mini FAQ – For SEO + Trust */}
      <section className="py-20 px-4 bg-gray-50" id="faq">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Quick Questions</h2>
          <div className="space-y-5">
            {[
              {
                q: "Is FormMirror GDPR and CCPA compliant?",
                a: "Yes. We never collect IP addresses, cookies, or personally identifiable information (PII). No consent banner needed."
              },
              {
                q: "How does drop-off detection work without tracking users?",
                a: "We analyze anonymous interaction patterns — like time per field and navigation flow — using aggregated, non-identifiable data."
              },
              {
                q: "Can I use FormMirror with Google Analytics?",
                a: "Absolutely. FormMirror complements GA by providing field-level insights that GA can’t capture due to privacy restrictions."
              }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border">
                <h3 className="font-bold text-gray-900">{item.q}</h3>
                <p className="text-gray-600 mt-2">{item.a}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/help" className="text-violet-600 font-medium hover:underline">
              View all FAQs →
            </Link>
          </div>
        </div>
      </section>

      {/* Exit Intent CTA */}
      {showExitCTA && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowExitCTA(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-md text-center" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Don’t Miss 40% More Leads
            </h3>
            <p className="text-gray-600 mb-6">
              Join 10,000+ marketers fixing broken forms with FormMirror.
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-xl transform hover:scale-105 transition-all"
            >
              Start Free Trial
              <ArrowRight className="ml-3 h-5 w-5" />
            </Link>
          </div>
        </div>
      )}

      {/* Scroll to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 p-3 bg-violet-600 text-white rounded-full shadow-lg hover:bg-violet-700 transition-all ${scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      {/* Footer */}
      <footer className="bg-white border-t py-12 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          <p>© 2025 FormMirror. Privacy-first form analytics. Made with love for better conversions.</p>
        </div>
      </footer>
    </>
  )
}
