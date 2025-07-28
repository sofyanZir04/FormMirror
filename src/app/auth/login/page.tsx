import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Lock, BarChart3, Shield, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sign In - FormMirror',
  description: 'Sign in to your FormMirror account to access your form analytics dashboard and track form performance.',
  keywords: 'sign in, login, formmirror login, analytics dashboard, form tracking login',
  openGraph: {
    title: 'Sign In - FormMirror',
    description: 'Sign in to your FormMirror account to access your form analytics dashboard.',
    url: 'https://formmirror.com/auth/login',
  },
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center">
              <Image src="/logo.svg" alt="FormMirror logo" width={48} height={48} className="mr-4" />
              <span className="text-2xl font-bold text-gray-900">FormMirror</span>
            </Link>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
              <p className="text-gray-600">Sign in to your account to continue</p>
            </div>

            <form className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="pl-10 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    className="pl-10 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center justify-center px-8">
          <div className="text-center text-white">
            <div className="mb-8">
              <div className="h-20 w-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold mb-4">Track Form Performance</h2>
              <p className="text-xl text-blue-100 max-w-md">
                Get actionable insights into your form interactions and improve conversion rates
              </p>
            </div>

            {/* Mock Dashboard Preview */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-sm mx-auto">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-green-300 mr-2" />
                    <span className="text-sm text-blue-100">Privacy</span>
                  </div>
                  <p className="text-2xl font-bold">100%</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 text-yellow-300 mr-2" />
                    <span className="text-sm text-blue-100">Speed</span>
                  </div>
                  <p className="text-2xl font-bold">Fast</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-blue-100">No cookies required</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-blue-100">GDPR compliant</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-blue-100">Real-time analytics</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 