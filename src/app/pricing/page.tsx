'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Check, X, Star, Zap, Shield, BarChart3, Users, Clock, 
  ArrowRight, ChevronRight, Sparkles, Crown, AlertCircle
} from 'lucide-react'

// === LEMON SQUEEZY CHECKOUT BUTTON ===
function CheckoutButton() {
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
    }, 8000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [isSDKReady, loadError])

  const handleCheckout = () => {
    const variantId = process.env.NEXT_PUBLIC_LEMONSQUEZY_PRO_VARIANT_ID
    if (!variantId || loadError || !isSDKReady) {
      alert('Checkout unavailable. Try disabling ad blockers or privacy extensions.')
      return
    }

    try {
      const ls = (window as any).LemonSqueezy
      ls.Url.Open(`https://checkout.lemonsqueezy.com/buy/${variantId}?embed=1&media=0&theme=dark`)
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
      className={`group relative w-full py-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center gap-3 overflow-hidden ${
        loadError
          ? 'bg-red-500/20 text-red-400 border border-red-500/50'
          : isSDKReady
          ? 'bg-white text-violet-600 hover:bg-gray-100'
          : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-20 transition-opacity" />
      {loadError ? (
        <>
          <AlertCircle className="h-5 w-5" />
          Checkout Blocked
        </>
      ) : isSDKReady ? (
        <>
          <Sparkles className="h-5 w-5" />
          Upgrade to Pro
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </>
      ) : (
        <>
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading Checkout...
        </>
      )}
    </button>
  )
}

// === MAIN PRICING PAGE ===
export default function PricingPage() {
  return (
    <>
      {/* === HERO SECTION === */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl mb-8 shadow-2xl animate-pulse">
            <Crown className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-300 to-teal-400">
            Go Pro. <span className="block sm:inline">Go Limitless.</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto mb-10 leading-relaxed">
            Turn form drop-offs into revenue. Get 90-day analytics, AI insights, and priority support.
          </p>

          <div className="flex justify-center mb-16">
            <div className="w-full max-w-md">
              <CheckoutButton />
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-400" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-emerald-400" />
              Cancel anytime
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              14-day money-back guarantee
            </div>
          </div>
        </div>
      </section>

      {/* === COMPARISON TABLE === */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 lg:p-12 border border-white/20 shadow-2xl">
            <h2 className="text-3xl lg:text-4xl font-black text-center mb-12 text-white">
              Everything in Free, plus...
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Free Plan */}
              <div>
                <h3 className="text-2xl font-bold text-gray-400 mb-8 flex items-center gap-3">
                  <X className="h-6 w-6 text-gray-500" />
                  Free Plan
                </h3>
                <ul className="space-y-5">
                  {[
                    { text: '7-day data retention', icon: Check },
                    { text: 'Unlimited forms', icon: Check },
                    { text: 'Basic field analytics', icon: Check },
                    { text: 'Community support', icon: Check },
                    { text: 'Export data', icon: X },
                    { text: 'AI insights', icon: X },
                    { text: 'Market benchmarks', icon: X },
                    { text: 'Priority support', icon: X },
                  ].map((item, i) => (
                    <li key={i} className={`flex items-center gap-4 ${item.icon === X ? 'opacity-50' : ''}`}>
                      <item.icon className={`h-6 w-6 ${item.icon === Check ? 'text-emerald-400' : 'text-gray-500'}`} />
                      <span className="text-gray-300">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pro Plan */}
              <div className="relative">
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-yellow-900 text-xs font-bold px-5 py-2 rounded-full shadow-lg rotate-12 animate-bounce">
                  BEST VALUE
                </div>
                <h3 className="text-2xl font-bold text-emerald-400 mb-8 flex items-center gap-3">
                  <Zap className="h-7 w-7 text-yellow-400" />
                  Pro Plan
                </h3>
                <ul className="space-y-5">
                  {[
                    '90-day data retention',
                    'Unlimited forms & events',
                    'Advanced segmentation',
                    'AI-powered insights',
                    'Export to CSV/JSON',
                    'Market benchmarks',
                    'Priority chat support',
                    'Custom branding removal',
                  ].map((text, i) => (
                    <li key={i} className="flex items-center gap-4">
                      <Check className="h-6 w-6 text-emerald-400" />
                      <span className="text-white font-medium">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === PRICING CARDS === */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Card */}
            <div className="group bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300 hover:shadow-2xl">
              <h3 className="text-2xl font-black text-gray-400 mb-4">Free</h3>
              <div className="text-5xl font-black text-white mb-2">$0</div>
              <p className="text-gray-400 mb-8">Forever free. No card needed.</p>
              
              <ul className="space-y-4 mb-10 text-gray-300">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-400" />
                  7-day analytics
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-400" />
                  Unlimited forms
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-400" />
                  Basic insights
                </li>
              </ul>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl py-4 px-6 text-center font-bold text-gray-300">
                Current Plan
              </div>
            </div>

            {/* Pro Card */}
            <div className="group relative bg-gradient-to-br from-emerald-500/20 via-teal-600/20 to-cyan-600/20 rounded-3xl p-8 border-4 border-emerald-400/50 shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 opacity-50 group-hover:opacity-70 transition-opacity" />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-3xl font-black text-white">Pro</h3>
                  <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
                </div>
                
                <div className="flex items-baseline mb-8">
                  <span className="text-6xl font-black text-white">$29</span>
                  <span className="text-xl text-gray-300 ml-2">/month</span>
                </div>

                <ul className="space-y-4 mb-10 text-white">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-emerald-300" />
                    90-day analytics
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-emerald-300" />
                    AI insights
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-emerald-300" />
                    Export data
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-emerald-300" />
                    Priority support
                  </li>
                </ul>

                <CheckoutButton />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === TRUST & FAQ === */}
      <section className="py-16 lg:py-20 bg-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-8">Trusted by developers worldwide</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl font-black text-emerald-400 mb-2">10K+</div>
              <p className="text-gray-300">Forms tracked</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl font-black text-teal-400 mb-2">4.9/5</div>
              <p className="text-gray-300">User satisfaction</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl font-black text-purple-400 mb-2">24/7</div>
              <p className="text-gray-300">Support response</p>
            </div>
          </div>

          <p className="text-gray-300 text-lg">
            Questions?{' '}
            <Link href="/contact" className="text-emerald-400 hover:underline font-medium">
              Contact us
            </Link>{' '}
            or read our{' '}
            <Link href="/help" className="text-emerald-400 hover:underline font-medium">
              documentation
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  )
}