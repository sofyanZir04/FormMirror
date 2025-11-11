'use client'

import Link from 'next/link'
import { useState } from 'react'
import { BookOpen, MessageCircle, Settings, Zap, Shield, CheckCircle, Mail, ArrowRight, XCircle, Globe, Cookie } from 'lucide-react'


export default function HelpContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqs = [
    {
      q: "Is FormMirror really privacy-friendly?",
      a: "Yes! We collect zero personal data. No cookies. No IPs. No tracking. Just anonymous form interactions to improve your conversions."
    },
    {
      q: "How does tracking work?",
      a: "Our lightweight script tracks field focus, blur, input, and submit events. It never captures the actual data entered. All data is anonymized and aggregated."
    },
    {
      q: "Free vs Pro plans?",
      a: "Free: 1,000 interactions/month, 30-day retention. Pro: unlimited, real-time, custom events, data export, priority support."
    },
    {
      q: "Can I export data?",
      a: "Yes — on Pro plans. Export to CSV for analysis in Excel, Google Sheets, or BI tools."
    },
    {
      q: "How do I add tracking?",
      a: "Copy the script from your dashboard and paste it into your site’s <head> or before </body>. Works with React, WordPress, Webflow, etc."
    },
    {
      q: "Need implementation help?",
      a: "We offer docs, videos, and email support. Pro users get priority + custom setup help."
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 text-white">
      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
              <img 
                src="/logo.svg" 
                alt="FormMirror Logo" 
                className="w-full h-full"
              />
            </div>
            <span className="text-xl font-bold text-white">FormMirror</span>
          </Link>
            {/* <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                <span className="text-white font-black text-lg">FM</span>
              </div>
              <span className="text-xl font-bold">FormMirror</span>
            </Link> */}
            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="text-gray-300 hover:text-white transition">
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="bg-white text-violet-600 px-5 py-2 rounded-xl font-bold hover:bg-gray-100 transition"
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Zap className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-black mb-4">
            Get Unstuck in 60 Seconds
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Full docs, FAQs, and support — all privacy-first, no fluff.
          </p>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: CheckCircle, label: "GDPR Compliant" },
            { icon: XCircle, label: "No Cookies" },
            { icon: Globe, label: "EU Hosting" },
            { icon: Shield, label: "10K+ Users" },
          ].map((badge, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <badge.icon className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-medium">{badge.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { href: "#getting-started", icon: Zap, title: "Getting Started", desc: "Setup in 60 seconds" },
            { href: "#user-guide", icon: BookOpen, title: "User Guide", desc: "Full feature docs" },
            { href: "#faq", icon: MessageCircle, title: "FAQ", desc: "Common questions" },
            { href: "#support", icon: Settings, title: "Support", desc: "Get help fast" },
          ].map((link, i) => (
            <Link key={i} href={link.href} className="group">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 hover:bg-white/20 transition-all border border-white/20 h-full">
                <div className="flex items-center mb-4">
                  <link.icon className="h-8 w-8 text-emerald-400 mr-3 group-hover:scale-110 transition" />
                  <h3 className="text-lg font-bold">{link.title}</h3>
                </div>
                <p className="text-gray-300">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Getting Started */}
      <section id="getting-started" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-3xl font-black mb-8 text-center">Get Started in 4 Steps</h2>
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20">
          <div className="space-y-10">
            {[
              {
                step: 1,
                title: "Create Account",
                desc: "Free forever. No credit card.",
                cta: "Sign Up Now",
                href: "/auth/register"
              },
              {
                step: 2,
                title: "Create Project",
                desc: "Name it after your form or site.",
                tip: "Use clear names: “Contact Form”, “Checkout”"
              },
              {
                step: 3,
                title: "Add Tracking Script",
                desc: "Copy & paste into your site.",
                code: `<script src="https://formmirror.com/track.js" data-project-id="YOUR_ID"></script>`
              },
              {
                step: 4,
                title: "See Insights",
                desc: "Data appears in < 60 seconds.",
                note: "Real-time on Pro"
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-black">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-300 mb-3">{item.desc}</p>
                  {item.tip && (
                    <p className="text-sm text-emerald-400 mb-3">Tip: {item.tip}</p>
                  )}
                  {item.code && (
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-sm overflow-x-auto">
                      {item.code}
                    </pre>
                  )}
                  {item.note && (
                    <p className="text-sm text-violet-400">{item.note}</p>
                  )}
                  {item.cta && (
                    <Link href={item.href!} className="inline-flex items-center text-emerald-400 hover:text-emerald-300 mt-3">
                      {item.cta} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Guide */}
      <section id="user-guide" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-3xl font-black mb-8 text-center">User Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: "Dashboard", items: ["Total interactions", "Conversion rate", "Abandonment map", "Field completion"] },
            { title: "Projects", items: ["Multiple forms", "Compare performance", "Team access", "Custom domains"] },
            { title: "Privacy", items: ["No personal data", "GDPR by default", "No cookies", "Anonymous sessions"] },
            { title: "Pro Features", items: ["Real-time", "Custom events", "Data export", "Advanced filters"] },
          ].map((card, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4">{card.title}</h3>
              <ul className="space-y-2">
                {card.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-3xl font-black mb-8 text-center">FAQ</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-white/5 transition"
              >
                <span className="font-bold pr-4">{faq.q}</span>
                <div className={`transform transition ${openFaq === i ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-gray-300">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Support */}
      <section id="support" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-3xl font-black mb-8 text-center">Get Support</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
            <Mail className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-3">Email Support</h3>
            <p className="text-gray-300 mb-4">Response in &gt; 24 hours</p>
            <a href="mailto:support@formmirror.com" className="text-violet-400 hover:text-violet-300">
              support@formmirror.com
            </a>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
            <MessageCircle className="h-12 w-12 text-violet-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-3">Feedback</h3>
            <p className="text-gray-300 mb-4">Help us improve</p>
            <Link href="/dashboard/feedback" className="text-emerald-400 hover:text-emerald-300">
              Submit Feedback
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center">
        <h3 className="text-3xl font-black mb-4">Ready to Track Forms Privately?</h3>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Start free. No credit card. No cookies. Just insights.
        </p>
        <Link
          href="/auth/register"
          className="inline-flex items-center bg-white text-violet-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
        >
          Start Free Trial
          <ArrowRight className="ml-3 h-6 w-6" />
        </Link>
      </div>
    </div>
  )
}