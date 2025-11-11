// 'use client'

import { BarChart3, Shield, Zap, Eye, Clock, TrendingUp } from 'lucide-react'

const features = [
  { icon: BarChart3, title: "Real-Time Analytics", desc: "Live form performance insights" },
  { icon: Shield, title: "Privacy-First", desc: "No cookies, GDPR compliant" },
  { icon: Zap, title: "Lightning Fast", desc: "Won't slow your site" },
  { icon: Eye, title: "Field-Level Insights", desc: "See where users drop off" },
  { icon: Clock, title: "Time Tracking", desc: "Measure field completion time" },
  { icon: TrendingUp, title: "Boost Conversions", desc: "Up to 40% increase" },
]

export default function Features() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-transparent to-purple-900/20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-black text-white text-center mb-16">
          Powerful Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="h-16 w-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition">
                <f.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}