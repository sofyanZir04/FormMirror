'use client'

import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      desc: "Perfect for testing",
      features: [
        "Up to 3 projects",
        "7-day history",
        "Basic insights",
        "Community support",
        "1,000 interactions/mo"
      ],
      cta: "Get Started Free",
      href: "/auth/register",
      variant: "outline"
    },
    {
      name: "Pro",
      price: "$19",
      desc: "For growing teams",
      popular: true,
      features: [
        "Unlimited projects",
        "90-day history",
        "Advanced insights",
        "Priority support",
        "50,000 interactions/mo",
        "Export data & reports"
      ],
      cta: "Upgrade to Pro",
      href: "/dashboard/upgrade",
      variant: "gradient"
    }
  ]

  return (
    <section className="py-20 px-4 bg-black/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-300">
            Start free. Scale when you’re ready.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-3xl p-8 border backdrop-blur-sm transition-all duration-300 hover:shadow-2xl ${
                plan.variant === "gradient"
                  ? "bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border-violet-500/50 hover:border-violet-400/70"
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-yellow-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="mb-2">
                <span className="text-5xl font-black text-white">{plan.price}</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="text-gray-400 mb-8">{plan.desc}</p>

              <ul className="space-y-3 mb-10 text-left">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-center text-gray-300">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-center block transition-all duration-300 ${
                  plan.variant === "gradient"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}