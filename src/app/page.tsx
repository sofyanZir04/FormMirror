'use client'

import { useAuth } from '@/contexts/AuthContext'
import AuthForm from '@/components/auth/AuthForm'
import Link from 'next/link'
import { ArrowRight, BarChart3, Shield, Zap, CheckCircle, Star, Users, TrendingUp, Eye, Lock, Clock, MessageSquare } from 'lucide-react'
import Head from 'next/head'

export default function HomePage() {  
  
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading FormMirror...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                <BarChart3 className="h-10 w-10 text-blue-600" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Welcome back!
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Ready to optimize your forms and boost conversions? Let's dive into your analytics.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/new-project"
                className="inline-flex items-center px-8 py-4 border-2 border-blue-200 text-lg font-semibold rounded-xl text-blue-700 bg-white hover:bg-blue-50 transition-all duration-200"
              >
                Create New Project
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Sticky Top Nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-blue-100">      
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900 tracking-tight">FormMirror</span>
            </div>
            {/* Navbar Right */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold focus:outline-none">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                  <span className="hidden sm:block">{user.email}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20 opacity-0 group-hover:opacity-100 group-hover:visible invisible group-hover:transition-all">
                  <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Dashboard</Link>
                  <button
                    onClick={signOut}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <nav className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">Features</a>
                <a href="#pricing" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">Pricing</a>
                <a href="#testimonials" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">Reviews</a>
                <Link href="/auth/login" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200">Sign in</Link>
                <Link href="/auth/register" className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">Get Started Free</Link>
              </nav>
            )}
            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-8">
              <Shield className="w-4 h-4 mr-2" />
              GDPR-compliant & Cookie-less
            </div>
            
            {/* Main headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-8 leading-tight">
              Understand why users
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                abandon your forms
              </span>
              without compromising privacy
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Pinpoint friction, confusion, and drop-off points with <strong>field-level analytics</strong> that respect user privacy. 
              Get actionable insights to boost conversions and reduce user frustration.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="/auth/register" 
                className="group inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="#demo" 
                className="inline-flex items-center px-8 py-4 rounded-xl bg-white border-2 border-gray-200 text-gray-700 font-semibold text-lg shadow-lg hover:shadow-xl hover:border-blue-200 transition-all duration-300"
              >
                <Eye className="mr-2 h-5 w-5" />
                See Demo
              </a>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Setup in 2 minutes
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Everything you need to optimize your forms
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful analytics that respect user privacy. Get insights that actually help you improve conversions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute -top-4 left-8 flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Field-level Analytics</h3>
                <p className="text-gray-600 leading-relaxed">
                  Track time spent on each field, skip rates, and drop-off points with precision. 
                  See exactly where users struggle and optimize accordingly.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute -top-4 left-8 flex items-center justify-center w-12 h-12 rounded-xl bg-green-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-6 w-6" />
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Privacy-First Design</h3>
                <p className="text-gray-600 leading-relaxed">
                  No video recordings or session replays. Cookie-free by design and fully GDPR-compliant. 
                  Respect user privacy while getting the insights you need.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute -top-4 left-8 flex items-center justify-center w-12 h-12 rounded-xl bg-purple-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-6 w-6" />
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Simple Setup</h3>
                <p className="text-gray-600 leading-relaxed">
                  One JavaScript snippet to install. No configuration required. 
                  Start tracking form analytics in under 2 minutes.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute -top-4 left-8 flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Actionable Insights</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get specific recommendations to improve your forms. 
                  Understand user behavior patterns and optimize for better conversions.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group relative bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute -top-4 left-8 flex items-center justify-center w-12 h-12 rounded-xl bg-red-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-6 w-6" />
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Real-time Data</h3>
                <p className="text-gray-600 leading-relaxed">
                  See form analytics in real-time. Monitor performance as it happens 
                  and make quick adjustments to improve user experience.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="group relative bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute -top-4 left-8 flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="h-6 w-6" />
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">User Segmentation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Analyze different user groups and their form behavior. 
                  Understand how different audiences interact with your forms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start free, upgrade anytime. No credit card required for the free tier.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="text-5xl font-extrabold text-blue-600 mb-2">$0</div>
                <p className="text-blue-600 font-medium">7-day analytics history</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Unlimited forms</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Up to 1,000 events/month</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">GDPR-compliant tracking</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Actionable form insights</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <div className="w-5 h-5 mr-3 flex-shrink-0">—</div>
                  <span>Market comparison</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <div className="w-5 h-5 mr-3 flex-shrink-0">—</div>
                  <span>Priority support</span>
                </li>
              </ul>
              
              <Link 
                href="/auth/register" 
                className="w-full block text-center px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200"
              >
                Start Free
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="relative bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl shadow-2xl p-8 text-white transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-5xl font-extrabold mb-2">$19<span className="text-2xl font-normal">/mo</span></div>
                <p className="text-purple-100 font-medium">Full analytics history</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>Unlimited forms</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>Unlimited events</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>GDPR-compliant tracking</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>Actionable form insights</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>Market comparison</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
              </ul>
              
              <Link 
                href="/auth/register?plan=pro" 
                className="w-full block text-center px-6 py-3 rounded-xl bg-white text-purple-600 font-semibold shadow-lg hover:bg-gray-50 transition-all duration-200"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>

          {/* Feature Comparison Table */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Detailed Feature Comparison</h3>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Feature</th>
                      <th className="px-6 py-4 text-center font-semibold text-blue-600">Free</th>
                      <th className="px-6 py-4 text-center font-semibold text-purple-600">Pro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr><td className="px-6 py-4 text-gray-700">Analytics history</td><td className="px-6 py-4 text-center">7 days</td><td className="px-6 py-4 text-center font-semibold">Unlimited</td></tr>
                    <tr><td className="px-6 py-4 text-gray-700">Events/month</td><td className="px-6 py-4 text-center">1,000</td><td className="px-6 py-4 text-center font-semibold">Unlimited</td></tr>
                    <tr><td className="px-6 py-4 text-gray-700">GDPR/cookie-less</td><td className="px-6 py-4 text-center">✅</td><td className="px-6 py-4 text-center">✅</td></tr>
                    <tr><td className="px-6 py-4 text-gray-700">Actionable insights</td><td className="px-6 py-4 text-center">✅</td><td className="px-6 py-4 text-center">✅</td></tr>
                    <tr><td className="px-6 py-4 text-gray-700">Market comparison</td><td className="px-6 py-4 text-center">—</td><td className="px-6 py-4 text-center font-semibold">✅</td></tr>
                    <tr><td className="px-6 py-4 text-gray-700">Priority support</td><td className="px-6 py-4 text-center">—</td><td className="px-6 py-4 text-center font-semibold">✅</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Loved by form optimization experts
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how teams are using FormMirror to boost their conversion rates and improve user experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
              </div>
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "FormMirror helped us identify that our checkout form was too long. We reduced it by 3 fields and saw a 40% increase in conversions."
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  SM
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Mitchell</div>
                  <div className="text-sm text-gray-600">Marketing Lead, SaaS Startup</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
              </div>
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "Love the privacy-first approach! No more creepy session replays. The insights are just as valuable without invading user privacy."
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  DJ
                </div>
                <div>
                  <div className="font-semibold text-gray-900">David Johnson</div>
                  <div className="text-sm text-gray-600">Product Manager, E-commerce</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
              </div>
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "Super easy to set up and the insights are immediately actionable. We doubled our form conversions in just one month."
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  LC
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Lisa Chen</div>
                  <div className="text-sm text-gray-600">Founder, Digital Agency</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to optimize your forms?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of teams using FormMirror to boost their conversion rates and improve user experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/register" 
              className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-blue-600 font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a 
              href="#feedback" 
              className="inline-flex items-center px-8 py-4 rounded-xl border-2 border-white text-white font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section id="feedback" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Help us improve FormMirror
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Share your ideas, report bugs, or request features. We'd love to hear from you!
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Feedback Form */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us feedback</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your feedback</label>
                  <textarea 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                    rows={4} 
                    placeholder="Share your ideas, suggestions, or report any issues..."
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email (optional)</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                    placeholder="your@email.com"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200"
                >
                  Send Feedback
                </button>
              </form>
            </div>

            {/* Recent Feedback */}
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <h3 className="font-bold text-blue-900 mb-4">Recent Community Feedback</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3 flex-shrink-0">A</div>
                    <div>
                      <p className="text-blue-900 text-sm">"Love the privacy-first approach! Would be great to have more integrations."</p>
                      <p className="text-blue-700 text-xs mt-1">— Alex, 2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3 flex-shrink-0">M</div>
                    <div>
                      <p className="text-blue-900 text-sm">"Helped us double our form conversions. The insights are incredibly valuable."</p>
                      <p className="text-blue-700 text-xs mt-1">— Maria, 1 week ago</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3 flex-shrink-0">J</div>
                    <div>
                      <p className="text-blue-900 text-sm">"Setup was super easy. Would love to see more export options."</p>
                      <p className="text-blue-700 text-xs mt-1">— James, 3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                <h3 className="font-bold text-green-900 mb-4">What's Coming Next</h3>
                <ul className="text-green-800 text-sm space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                    Slack & Discord integrations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                    Advanced user segmentation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                    A/B testing insights
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                    Custom dashboard widgets
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center mb-2">
            <BarChart3 className="h-7 w-7 text-blue-400" />
            <span className="ml-2 text-lg font-bold">FormMirror</span>
          </div>
          <p className="text-gray-400 text-sm">&copy; 2024 FormMirror. All rights reserved.</p>
          <div className="mt-2 flex gap-4">
            <a href="/dashboard/privacy-policy" className="text-gray-400 hover:text-white text-xs underline">Privacy Policy</a>
            <a href="/dashboard/terms" className="text-gray-400 hover:text-white text-xs underline">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
