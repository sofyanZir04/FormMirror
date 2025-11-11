'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Check, Star, Zap, Shield, BarChart3, Users, Clock, ArrowRight, X } from 'lucide-react'

// LemonSqueezy Checkout Button
export function CheckoutButton() {
  const [isSDKReady, setIsSDKReady] = useState(false)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    const init = () => {
      if (typeof (window as any).createLemonSqueezy === 'function') {
        try {
          (window as any).createLemonSqueezy()
          setIsSDKReady(true)
          return true
        } catch (err) {
          setLoadError(true)
        }
      }
      return false
    }

    if (init()) return

    const interval = setInterval(() => {
      if (init() || loadError) clearInterval(interval)
    }, 100)

    const timeout = setTimeout(() => {
      clearInterval(interval)
      if (!isSDKReady) setLoadError(true)
    }, 10000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [isSDKReady, loadError])

  const handleCheckout = () => {
    const variantId = process.env.NEXT_PUBLIC_LEMONSQUEZY_PRO_VARIANT_ID
    if (!variantId || loadError || !isSDKReady) {
      alert('Checkout unavailable. Try disabling ad blockers.')
      return
    }

    try {
      const ls = (window as any).LemonSqueezy
      ls.Url.Open(`https://checkout.lemonsqueezy.com/buy/${variantId}?embed=1&media=0`)
      ls.Setup({
        eventHandler: (e: any) => {
          if (e.eventName === 'Checkout.Success') {
            window.location.href = '/dashboard'
          }
        },
      })
    } catch (err) {
      alert('Failed to open checkout. Please disable privacy extensions.')
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={!isSDKReady || loadError}
      className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-3 ${
        loadError
          ? 'bg-red-500/20 text-red-400 border border-red-500/50'
          : isSDKReady
          ? 'bg-white text-violet-600 hover:bg-gray-100'
          : 'bg-gray-300 text-gray-500'
      }`}
    >
      {loadError ? (
        <>Checkout Blocked</>
      ) : isSDKReady ? (
        <>
          Upgrade to Pro <ArrowRight className="h-5 w-5" />
        </>
      ) : (
        <>Loading...</>
      )}
    </button>
  )
}

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6 shadow-xl">
            <Star className="h-9 w-9 text-white" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-black mb-4">
            Level Up to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Pro</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Unlock deeper insights, longer history, and priority support. Turn form data into revenue.
          </p>
          <div className="flex justify-center">
            <CheckoutButton />
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-16 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-black mb-6 text-gray-400">Free</h2>
              <ul className="space-y-4">
                {[
                  { text: '7-day analytics', icon: Check },
                  { text: 'Unlimited forms', icon: Check },
                  { text: 'Basic field insights', icon: Check },
                  { text: 'Email support', icon: Check, disabled: true },
                  { text: 'Market benchmarks', icon: X, disabled: true },
                ].map((item, i) => (
                  <li key={i} className={`flex items-center gap-3 ${item.disabled ? 'opacity-40' : ''}`}>
                    <item.icon className={`h-5 w-5 ${item.disabled ? 'text-gray-500' : 'text-emerald-400'}`} />
                    <span className="text-gray-300">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-black mb-6 text-emerald-400 flex items-center gap-3">
                Pro <Zap className="h-6 w-6" />
              </h2>
              <ul className="space-y-4">
                {[
                  '90-day analytics history',
                  'Unlimited forms & events',
                  'Advanced segmentation',
                  'Priority chat & email support',
                  'Market comparison & benchmarks',
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-emerald-400" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div id="pricing" className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Free Card */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 text-center">
            <h3 className="text-xl font-bold text-gray-400 mb-3">Free</h3>
            <div className="text-4xl font-black text-white mb-6">$0</div>
            <ul className="space-y-3 text-sm text-gray-400 mb-8">
              <li>7-day history</li>
              <li>Unlimited forms</li>
              <li>Basic insights</li>
            </ul>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl py-3 px-6 text-sm font-medium text-gray-300">
              Current Plan
            </div>
          </div>

          {/* Pro Card */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 border-4 border-emerald-400 relative overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1 rounded-full shadow-lg rotate-12">
              MOST POPULAR
            </div>
            <h3 className="text-2xl font-black mb-3">Pro</h3>
            <div className="text-5xl font-black mb-6">
              $29<span className="text-xl font-medium">/mo</span>
            </div>
            <ul className="space-y-3 text-sm mb-8">
              <li>90-day analytics</li>
              <li>Advanced filters</li>
              <li>Priority support</li>
              <li>Market benchmarks</li>
            </ul>
            <CheckoutButton />
          </div>
        </div>

        {/* Trust & FAQ */}
        <div className="text-center space-y-8">
          <div className="flex justify-center items-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-400" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-emerald-400" />
              Cancel anytime
            </div>
          </div>
          <p className="text-gray-400">
            Questions?{' '}
            <Link href="/dashboard/feedback" className="text-emerald-400 hover:underline">
              Contact support
            </Link>{' '}
            or see our{' '}
            <Link href="/help" className="text-emerald-400 hover:underline">
              documentation
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
