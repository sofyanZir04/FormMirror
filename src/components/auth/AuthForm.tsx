'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: '/dashboard',
    })
    setLoading(false)
    if (res?.error) {
      setError(res.error)
    } else if (res?.ok) {
      window.location.href = '/dashboard'
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error || 'Registration failed')
    } else {
      setSuccess('Registration successful! Signing you in...')
      // Auto sign in after registration
      await handleSignIn(e)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{mode === 'signin' ? 'Sign in to FormMirror' : 'Register for FormMirror'}</h1>
      <p className="mb-4 text-gray-600">{mode === 'signin' ? 'Sign in with your email and password' : 'Create a new account'}</p>
      <div className="flex justify-center mb-4 space-x-2">
        <button
          type="button"
          className={`px-4 py-2 rounded-md font-medium ${mode === 'signin' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setMode('signin')}
        >
          Sign In
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-md font-medium ${mode === 'signup' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setMode('signup')}
        >
          Sign Up
        </button>
      </div>
      <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-4 text-left">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Your password"
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? (mode === 'signin' ? 'Signing in...' : 'Signing up...') : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
        </button>
      </form>
    </div>
  )
} 