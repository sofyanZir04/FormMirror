'use client'

import { useState } from 'react'
import { Check, Star, Zap, Shield, Users, Clock, BarChart3, Crown } from 'lucide-react'
import Link from 'next/link'

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 py-8 sm:py-12">
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12 px-4 sm:px-6">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-4 sm:mb-6">
          <Star className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">Upgrade to Pro</h1>
        <p className="text-base sm:text-lg text-gray-600 mb-6 max-w-2xl mx-auto px-4">
          Unlock advanced analytics, longer data retention, and premium support. Take your form optimization to the next level!
        </p>
        <Link href="#pricing" className="inline-block px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          See Pro Plans
        </Link>
      </div>

      {/* Comparison Section */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-12 sm:mb-16 mx-4 sm:mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-blue-700 mb-4">Free</h2>
            <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
              <li className="flex items-center"><Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 flex-shrink-0" /> 7-day analytics history</li>
              <li className="flex items-center"><Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 flex-shrink-0" /> Unlimited forms</li>
              <li className="flex items-center"><Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 flex-shrink-0" /> Field-level insights</li>
              <li className="flex items-center opacity-50"><Check className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" /> Email support</li>
              <li className="flex items-center opacity-50"><Check className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" /> Market comparison</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-purple-700 mb-4">Pro</h2>
            <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
              <li className="flex items-center"><Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 flex-shrink-0" /> 90-day analytics history</li>
              <li className="flex items-center"><Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 flex-shrink-0" /> Unlimited forms & events</li>
              <li className="flex items-center"><Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 flex-shrink-0" /> Advanced segmentation</li>
              <li className="flex items-center"><Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 flex-shrink-0" /> Priority email & chat support</li>
              <li className="flex items-center"><Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 flex-shrink-0" /> Market comparison & benchmarks</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div id="pricing" className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center border-2 border-blue-100">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Free</h3>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 mb-4">$0</div>
          <ul className="mb-6 space-y-2 text-gray-700 text-sm sm:text-base text-center">
            <li>7-day analytics</li>
            <li>Unlimited forms</li>
            <li>Basic insights</li>
          </ul>
          <span className="inline-block px-4 sm:px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold text-sm">Current Plan</span>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col items-center border-4 border-purple-300 relative">
          <div className="absolute -top-3 sm:-top-5 right-4 sm:right-6 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 sm:px-3 py-1 rounded-full shadow">Most Popular</div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Pro</h3>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mb-4">$19<span className="text-base sm:text-lg font-medium">/mo</span></div>
          <ul className="mb-6 space-y-2 text-white/90 text-sm sm:text-base text-center">
            <li>90-day analytics</li>
            <li>Advanced segmentation</li>
            <li>Priority support</li>
            <li>Market comparison</li>
          </ul>
          <button className="inline-block px-6 sm:px-8 py-3 rounded-xl bg-yellow-400 text-blue-900 font-bold text-base sm:text-lg shadow-lg hover:bg-yellow-300 transition-all">Upgrade to Pro</button>
        </div>
      </div>

      {/* FAQ or Contact */}
      <div className="max-w-2xl mx-auto text-center mt-12 sm:mt-16 text-gray-600 text-xs sm:text-sm px-4">
        Have questions? <Link href="/dashboard/settings" className="text-blue-600 hover:underline">Contact support</Link> or see our <Link href="#" className="text-blue-600 hover:underline">FAQ</Link>.
      </div>
    </div>
  );
} 