// src/app/dashboard/upgrade/page.tsx
'use client';

import Script from 'next/script';
import { CheckoutButton } from '@/components/CheckoutButton';
import { Check, X } from 'lucide-react';

export default function UpgradePage() {
  return (
    <>
      <Script 
        src="https://app.lemonsqueezy.com/js/lemon.js" 
        strategy="lazyOnload"
        onLoad={() => {
          console.log('✅ LemonSqueezy script loaded');
          if (typeof window !== 'undefined' && (window as any).createLemonSqueezy) {
            (window as any).createLemonSqueezy();
            console.log('✅ LemonSqueezy initialized');
          }
        }}
        onError={(e) => {
          console.error('❌ Failed to load LemonSqueezy script:', e);
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
              Upgrade to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Pro</span>
            </h1>
            <p className="text-xl text-gray-600">
              Unlock unlimited forms and advanced analytics
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="text-5xl font-black text-gray-900">
                  $0
                  <span className="text-lg font-normal text-gray-500">/month</span>
                </div>
                <p className="text-gray-500 mt-2">Current Plan</p>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Up to 3 projects</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">7-day analytics history</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">1,000 interactions/month</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400 line-through">Advanced insights</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400 line-through">Export data</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400 line-through">Priority support</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 border-2 border-blue-400 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  🔥 Most Popular
                </span>
              </div>

              <div className="text-center mb-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-5xl font-black">
                  $19
                  <span className="text-lg font-normal opacity-80">/month</span>
                </div>
                <p className="opacity-90 mt-2">Recommended for growth</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-white">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">Unlimited projects</span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">90-day analytics history</span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">50,000 interactions/month</span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">Advanced field insights</span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">Export data & reports</span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">Priority email support</span>
                </li>
              </ul>

              <CheckoutButton />
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <details className="bg-white rounded-lg p-6 shadow-md">
                <summary className="font-semibold text-gray-900 cursor-pointer">
                  Can I cancel anytime?
                </summary>
                <p className="mt-3 text-gray-600">
                  Yes! You can cancel your subscription at any time. You&apos;ll keep access until the end of your billing period.
                </p>
              </details>
              
              <details className="bg-white rounded-lg p-6 shadow-md">
                <summary className="font-semibold text-gray-900 cursor-pointer">
                  What payment methods do you accept?
                </summary>
                <p className="mt-3 text-gray-600">
                  We accept all major credit cards (Visa, Mastercard, Amex) and PayPal through our secure payment processor.
                </p>
              </details>
              
              <details className="bg-white rounded-lg p-6 shadow-md">
                <summary className="font-semibold text-gray-900 cursor-pointer">
                  What if the embedded checkout doesn&apos;t work?
                </summary>
                <p className="mt-3 text-gray-600">
                  If you have ad blockers enabled, the checkout will automatically open in a new tab. You can also disable your ad blocker temporarily for the best experience.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}