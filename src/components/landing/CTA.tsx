// 'use client'

import Link from 'next/link'
import { Rocket, Play, ArrowRight } from 'lucide-react'

export default function CTA() {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
          Ready to Optimize Your Forms?
        </h2>
        <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
          Join thousands of developers and marketers using privacy-first analytics to boost conversions.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/register"
            className="group inline-flex items-center px-8 py-4 bg-white text-violet-700 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            <Rocket className="mr-2 h-5 w-5" />
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition" />
          </Link>

          <Link
            href="/demo"
            className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-violet-700 transition-all duration-300 backdrop-blur-sm"
          >
            <Play className="mr-2 h-5 w-5" />
            Watch Demo
          </Link>
        </div>
      </div>

      {/* Animated background glow */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse" />
      </div>
    </section>
  )
}