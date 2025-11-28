'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { 
  Check, X, Zap, Shield, Sparkles, Crown, AlertCircle, 
  Loader2, ExternalLink, ArrowLeft
} from 'lucide-react'

// === CHECKOUT BUTTON (YOUR EXACT UX) ===
function CheckoutButton() {
  const [isChecking, setIsChecking] = useState(true)
  const [isSDKReady, setIsSDKReady] = useState(false)
  const scriptRef = useRef<HTMLScriptElement | null>(null)

  const variantId = process.env.NEXT_PUBLIC_LEMONSQUEZY_PRO_VARIANT_ID

  useEffect(() => {
    if (!variantId) {
      setIsChecking(false)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://app.lemonsqueezy.com/js/checkout.js'
    script.async = true
    script.crossOrigin = 'anonymous'

    script.onload = () => {
      try {
        ;(window as any).createLemonSqueezy()
        setIsSDKReady(true)
      } catch (err) {
        console.error('LemonSqueezy SDK failed')
      } finally {
        setIsChecking(false)
      }
    }

    script.onerror = () => {
      setIsChecking(false)
    }

    document.head.appendChild(script)
    scriptRef.current = script

    return () => {
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        document.head.removeChild(scriptRef.current)
      }
    }
  }, [variantId])

  const handleCheckout = () => {
    if (!variantId) return

    const popup = window.open(
      `https://checkout.lemonsqueezy.com/buy/${variantId}?embed=1&media=0&theme=dark`,
      'checkout',
      'width=600,height=800,scrollbars=yes,resizable=yes'
    )

    if (!popup) {
      alert('Please allow popups to continue.')
      return
    }

    if (isSDKReady) {
      const ls = (window as any).LemonSqueezy
      ls.Setup({
        eventHandler: (e: any) => {
          if (e.eventName === 'Checkout.Success') {
            popup.close()
            window.location.href = '/dashboard?upgraded=1'
          }
        },
      })
    }
  }

  return (
    <div className="w-full space-y-2">
      <button
        onClick={handleCheckout}
        disabled={isChecking || !variantId}
        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 transform hover:scale-105 shadow-2xl ${
          isChecking || !variantId
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-400 hover:to-teal-500'
        }`}
      >
        {isChecking ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading Checkout...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Start Converting More Users
            {!isSDKReady && <ExternalLink className="w-5 h-5" />}
          </>
        )}
      </button>

      {/* Info Message */}
      {!isChecking && !isSDKReady && (
        <div className="flex items-start gap-2 text-xs text-emerald-300 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
          <p>
            Checkout will open in a new tab. If you have ad blockers, please allow popups for <span className="font-medium">lemonsqueezy.com</span>.
          </p>
        </div>
      )}

      {/* Fallback Link */}
      {!isChecking && variantId && (
        <a
          href={`https://checkout.lemonsqueezy.com/buy/${variantId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-sm text-gray-400 hover:text-emerald-400 underline transition"
        >
          Or click here to checkout directly
        </a>
      )}
    </div>
  )
}

// === MAIN PRICING PAGE – ULTRA-PREMIUM ===
export default function PricingPage() {
  return (
    <>
      {/* === NAVBAR – MINIMAL & ELEGANT === */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-gray-300 hover:text-emerald-400 transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden shadow-md">
                <img src="/logo.svg" alt="FormMirror" className="w-full h-full object-cover" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">FormMirror</span>
            </div>
          </div>
        </div>
      </nav>

      {/* === HERO – BREATHTAKING, CLEAN, MODERN === */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/50 via-transparent to-transparent" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
          <div className="absolute top-32 right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-32 left-20 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-600 rounded-3xl mb-8 shadow-2xl">
            <Crown className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-300 to-teal-400">
              Go Pro.
            </span>
            <span className="block sm:inline text-white"> Go Limitless.</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-400 max-w-4xl mx-auto mb-12 leading-relaxed font-light">
            Turn every form drop-off into a conversion. Get 90-day analytics, AI insights, and priority support.
          </p>

          <div className="flex justify-center mb-16">
            <div className="w-full max-w-md">
              <CheckoutButton />
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-400" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-emerald-400" />
              Cancel anytime
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-400" />
              14-day money-back guarantee
            </div>
          </div>
        </div>
      </section>

      {/* === COMPARISON TABLE – CLEAN GLASS === */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-gray-900 backdrop-blur-3xl rounded-3xl p-8 lg:p-12 border border-white/10 shadow-2xl">
            <h2 className="text-3xl lg:text-4xl font-black text-center mb-12 text-white">
              Everything in Free, plus...
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Free */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-400 mb-6 flex items-center gap-3">
                  <X className="h-6 w-6 text-gray-500" />
                  Free Plan
                </h3>
                <ul className="space-y-4">
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
                      <span className="text-gray-300 text-base">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pro */}
              <div className="relative space-y-6">
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-amber-400 to-orange-600 text-white text-xs font-bold px-5 py-2 rounded-full shadow-lg rotate-12">
                  BEST VALUE
                </div>
                <h3 className="text-2xl font-bold text-emerald-400 mb-6 flex items-center gap-3">
                  <Zap className="h-7 w-7 text-amber-400" />
                  Pro Plan
                </h3>
                <ul className="space-y-4">
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
                      <span className="text-white font-medium text-base">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === PRICING CARDS – MODERN & CLEAN === */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-transparent via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="group bg-white/5 backdrop-blur-3xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
              <h3 className="text-2xl font-black text-gray-300 mb-4">Free</h3>
              <div className="text-5xl font-black text-white mb-2">$0</div>
              <p className="text-gray-300 mb-8 text-base">Forever free. No card needed.</p>
              
              <ul className="space-y-4 mb-10 text-gray-400">
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

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl py-4 px-6 text-center font-bold text-gray-400">
                Current Plan
              </div>
            </div>

            {/* Pro
            <div className="group relative bg-gradient-to-br from-emerald-600/20 via-teal-600/20 to-cyan-600/20 rounded-3xl p-8 border-4 border-emerald-500/40 shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-3xl font-black text-white">Pro</h3>
                  <Sparkles className="h-8 w-8 text-amber-400 animate-pulse" />
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
            </div> */}
            {/* Premium Plan - Marketing Rebuild */}
<div className="group relative bg-gray-900 border-4 border-teal-500/80 rounded-3xl p-8 shadow-2xl shadow-teal-500/30 transform hover:scale-[1.02] transition-all duration-300 overflow-hidden">
    
    {/* Background/Design elements (kept simple but with less focus) */}
    <div className="absolute inset-0 bg-gradient-to-br from-teal-900 to-cyan-900 opacity-90 transition-opacity" />
    <div className="absolute top-0 right-0 h-40 w-40 bg-teal-500/10 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4" />
    
    <div className="relative z-10">
        
        {/* Header with Marketing Angle */}
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
                Premium
            </h3>
            {/* Value-added feature indicator */}
            <Sparkles className="h-8 w-8 text-amber-400 animate-pulse" />
        </div>
        
        {/* Annual Discount Badge - KEY MARKETING ELEMENT */}
        <span className="inline-flex items-center rounded-full bg-teal-500/20 px-3 py-1 text-sm font-semibold text-teal-300 mb-6">
            ✨ Save 30% with Annual Billing!
        </span>

        {/* Pricing Block - Highlighting Monthly and Annual */}
        <div className="mb-8">
            {/* Monthly Price */}
            <div className="flex items-baseline">
                <span className="text-5xl font-black text-white">$12</span>
                <span className="text-xl text-gray-300 ml-2">/month</span>
            </div>
            {/* Annual Price/Value */}
            <p className="text-base text-teal-300 mt-2">
                or get a better deal: <span className="font-bold text-white">$99 / year</span>
            </p>
        </div>

        {/* Feature/Benefit List - Refocused on Outcomes */}
        <ul className="space-y-4 mb-10 text-white">
            <li className="flex items-start gap-3">
                <Check className="h-5 w-5 mt-1 text-teal-300 shrink-0" />
                <div>
                    <span className="font-semibold">Deep Dive Analytics:</span> Go beyond 90 days to understand long-term trends and growth.
                </div>
            </li>
            <li className="flex items-start gap-3">
                <Check className="h-5 w-5 mt-1 text-teal-300 shrink-0" />
                <div>
                    <span className="font-semibold">Actionable AI Insights:</span> Get specific, data-driven recommendations on *what* to do next to optimize performance.
                </div>
            </li>
            <li className="flex items-start gap-3">
                <Check className="h-5 w-5 mt-1 text-teal-300 shrink-0" />
                <div>
                    <span className="font-semibold">Full Data Control</span>                    
                </div>
            </li>
        </ul>

        <CheckoutButton>
            Start Your Premium Access Today
        </CheckoutButton>
    </div>
</div>

          </div>
        </div>
      </section>

      {/* === TRUST – CLEAN & MODERN === */}
      <section className="py-16 lg:py-20 bg-slate-950/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-8">Trusted by developers worldwide</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/5 backdrop-blur-3xl rounded-2xl p-6 border border-emerald-500/20">
              <div className="text-4xl font-black text-emerald-400 mb-2">10K+</div>
              <p className="text-gray-400">Forms tracked</p>
            </div>
            <div className="bg-white/5 backdrop-blur-3xl rounded-2xl p-6 border border-teal-500/20">
              <div className="text-4xl font-black text-teal-400 mb-2">4.9/5</div>
              <p className="text-gray-400">User satisfaction</p>
            </div>
            <div className="bg-white/5 backdrop-blur-3xl rounded-2xl p-6 border border-purple-500/20">
              <div className="text-4xl font-black text-purple-400 mb-2">24/7</div>
              <p className="text-gray-400">Support response</p>
            </div>
          </div>

          <p className="text-gray-400 text-lg">
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


// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { 
//   Check, X, Star, Zap, Shield, BarChart3, Users, Clock, 
//   ArrowRight, ChevronRight, Sparkles, Crown, AlertCircle
// } from 'lucide-react'

// // === LEMON SQUEEZY CHECKOUT BUTTON ===
// function CheckoutButton() {
//   const [isSDKReady, setIsSDKReady] = useState(false)
//   const [loadError, setLoadError] = useState(false)

//   useEffect(() => {
//     const init = () => {
//       if (typeof (window as any).createLemonSqueezy === 'function') {
//         try {
//           (window as any).createLemonSqueezy()
//           setIsSDKReady(true)
//           return true
//         } catch (err) {
//           setLoadError(true)
//         }
//       }
//       return false
//     }

//     if (init()) return

//     const interval = setInterval(() => {
//       if (init() || loadError) clearInterval(interval)
//     }, 100)

//     const timeout = setTimeout(() => {
//       clearInterval(interval)
//       if (!isSDKReady) setLoadError(true)
//     }, 8000)

//     return () => {
//       clearInterval(interval)
//       clearTimeout(timeout)
//     }
//   }, [isSDKReady, loadError])

//   const handleCheckout = () => {
//     const variantId = process.env.NEXT_PUBLIC_LEMONSQUEZY_PRO_VARIANT_ID
//     if (!variantId || loadError || !isSDKReady) {
//       alert('Checkout unavailable. Try disabling ad blockers or privacy extensions.')
//       return
//     }

//     try {
//       const ls = (window as any).LemonSqueezy
//       ls.Url.Open(`https://checkout.lemonsqueezy.com/buy/${variantId}?embed=1&media=0&theme=dark`)
//       ls.Setup({
//         eventHandler: (e: any) => {
//           if (e.eventName === 'Checkout.Success') {
//             window.location.href = '/dashboard'
//           }
//         },
//       })
//     } catch (err) {
//       alert('Failed to open checkout. Please disable privacy extensions.')
//     }
//   }

//   return (
//     <button
//       onClick={handleCheckout}
//       disabled={!isSDKReady || loadError}
//       className={`group relative w-full py-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center gap-3 overflow-hidden ${
//         loadError
//           ? 'bg-red-500/20 text-red-400 border border-red-500/50'
//           : isSDKReady
//           ? 'bg-white text-violet-600 hover:bg-gray-100'
//           : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed'
//       }`}
//     >
//       <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-20 transition-opacity" />
//       {loadError ? (
//         <>
//           <AlertCircle className="h-5 w-5" />
//           Checkout Blocked
//         </>
//       ) : isSDKReady ? (
//         <>
//           <Sparkles className="h-5 w-5" />
//           Upgrade to Pro
//           <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
//         </>
//       ) : (
//         <>
//           <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
//           Loading Checkout...
//         </>
//       )}
//     </button>
//   )
// }

// // === MAIN PRICING PAGE ===
// export default function PricingPage() {
//   return (
//     <>
//       {/* === HERO SECTION === */}
//       <section className="relative overflow-hidden py-20 lg:py-28">
//         <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900" />
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
        
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl mb-8 shadow-2xl animate-pulse">
//             <Crown className="h-10 w-10 text-white" />
//           </div>
          
//           <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-300 to-teal-400">
//             Go Pro. <span className="block sm:inline">Go Limitless.</span>
//           </h1>
          
//           <p className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto mb-10 leading-relaxed">
//             Turn form drop-offs into revenue. Get 90-day analytics, AI insights, and priority support.
//           </p>

//           <div className="flex justify-center mb-16">
//             <div className="w-full max-w-md">
//               <CheckoutButton />
//             </div>
//           </div>

//           <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400">
//             <div className="flex items-center gap-2">
//               <Shield className="h-5 w-5 text-emerald-400" />
//               No credit card required
//             </div>
//             <div className="flex items-center gap-2">
//               <Check className="h-5 w-5 text-emerald-400" />
//               Cancel anytime
//             </div>
//             <div className="flex items-center gap-2">
//               <Zap className="h-5 w-5 text-yellow-400" />
//               14-day money-back guarantee
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* === COMPARISON TABLE === */}
//       <section className="py-16 lg:py-24">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 lg:p-12 border border-white/20 shadow-2xl">
//             <h2 className="text-3xl lg:text-4xl font-black text-center mb-12 text-white">
//               Everything in Free, plus...
//             </h2>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//               {/* Free Plan */}
//               <div>
//                 <h3 className="text-2xl font-bold text-gray-400 mb-8 flex items-center gap-3">
//                   <X className="h-6 w-6 text-gray-500" />
//                   Free Plan
//                 </h3>
//                 <ul className="space-y-5">
//                   {[
//                     { text: '7-day data retention', icon: Check },
//                     { text: 'Unlimited forms', icon: Check },
//                     { text: 'Basic field analytics', icon: Check },
//                     { text: 'Community support', icon: Check },
//                     { text: 'Export data', icon: X },
//                     { text: 'AI insights', icon: X },
//                     { text: 'Market benchmarks', icon: X },
//                     { text: 'Priority support', icon: X },
//                   ].map((item, i) => (
//                     <li key={i} className={`flex items-center gap-4 ${item.icon === X ? 'opacity-50' : ''}`}>
//                       <item.icon className={`h-6 w-6 ${item.icon === Check ? 'text-emerald-400' : 'text-gray-500'}`} />
//                       <span className="text-gray-300">{item.text}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               {/* Pro Plan */}
//               <div className="relative">
//                 <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-yellow-900 text-xs font-bold px-5 py-2 rounded-full shadow-lg rotate-12 animate-bounce">
//                   BEST VALUE
//                 </div>
//                 <h3 className="text-2xl font-bold text-emerald-400 mb-8 flex items-center gap-3">
//                   <Zap className="h-7 w-7 text-yellow-400" />
//                   Pro Plan
//                 </h3>
//                 <ul className="space-y-5">
//                   {[
//                     '90-day data retention',
//                     'Unlimited forms & events',
//                     'Advanced segmentation',
//                     'AI-powered insights',
//                     'Export to CSV/JSON',
//                     'Market benchmarks',
//                     'Priority chat support',
//                     'Custom branding removal',
//                   ].map((text, i) => (
//                     <li key={i} className="flex items-center gap-4">
//                       <Check className="h-6 w-6 text-emerald-400" />
//                       <span className="text-white font-medium">{text}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* === PRICING CARDS === */}
//       <section className="py-16 lg:py-24">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
//             {/* Free Card */}
//             <div className="group bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300 hover:shadow-2xl">
//               <h3 className="text-2xl font-black text-gray-400 mb-4">Free</h3>
//               <div className="text-5xl font-black text-white mb-2">$0</div>
//               <p className="text-gray-400 mb-8">Forever free. No card needed.</p>
              
//               <ul className="space-y-4 mb-10 text-gray-300">
//                 <li className="flex items-center gap-3">
//                   <Check className="h-5 w-5 text-emerald-400" />
//                   7-day analytics
//                 </li>
//                 <li className="flex items-center gap-3">
//                   <Check className="h-5 w-5 text-emerald-400" />
//                   Unlimited forms
//                 </li>
//                 <li className="flex items-center gap-3">
//                   <Check className="h-5 w-5 text-emerald-400" />
//                   Basic insights
//                 </li>
//               </ul>

//               <div className="bg-white/10 backdrop-blur-sm rounded-2xl py-4 px-6 text-center font-bold text-gray-300">
//                 Current Plan
//               </div>
//             </div>

//             {/* Pro Card */}
//             <div className="group relative bg-gradient-to-br from-emerald-500/20 via-teal-600/20 to-cyan-600/20 rounded-3xl p-8 border-4 border-emerald-400/50 shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
//               <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 opacity-50 group-hover:opacity-70 transition-opacity" />
//               <div className="absolute -top-6 -right-6 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl" />
              
//               <div className="relative z-10">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-3xl font-black text-white">Pro</h3>
//                   <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
//                 </div>
                
//                 <div className="flex items-baseline mb-8">
//                   <span className="text-6xl font-black text-white">$29</span>
//                   <span className="text-xl text-gray-300 ml-2">/month</span>
//                 </div>

//                 <ul className="space-y-4 mb-10 text-white">
//                   <li className="flex items-center gap-3">
//                     <Check className="h-5 w-5 text-emerald-300" />
//                     90-day analytics
//                   </li>
//                   <li className="flex items-center gap-3">
//                     <Check className="h-5 w-5 text-emerald-300" />
//                     AI insights
//                   </li>
//                   <li className="flex items-center gap-3">
//                     <Check className="h-5 w-5 text-emerald-300" />
//                     Export data
//                   </li>
//                   <li className="flex items-center gap-3">
//                     <Check className="h-5 w-5 text-emerald-300" />
//                     Priority support
//                   </li>
//                 </ul>

//                 <CheckoutButton />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* === TRUST & FAQ === */}
//       <section className="py-16 lg:py-20 bg-white/5 backdrop-blur-xl">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-3xl font-black text-white mb-8">Trusted by developers worldwide</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
//             <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
//               <div className="text-4xl font-black text-emerald-400 mb-2">10K+</div>
//               <p className="text-gray-300">Forms tracked</p>
//             </div>
//             <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
//               <div className="text-4xl font-black text-teal-400 mb-2">4.9/5</div>
//               <p className="text-gray-300">User satisfaction</p>
//             </div>
//             <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
//               <div className="text-4xl font-black text-purple-400 mb-2">24/7</div>
//               <p className="text-gray-300">Support response</p>
//             </div>
//           </div>

//           <p className="text-gray-300 text-lg">
//             Questions?{' '}
//             <Link href="/contact" className="text-emerald-400 hover:underline font-medium">
//               Contact us
//             </Link>{' '}
//             or read our{' '}
//             <Link href="/help" className="text-emerald-400 hover:underline font-medium">
//               documentation
//             </Link>
//             .
//           </p>
//         </div>
//       </section>
//     </>
//   )
// }