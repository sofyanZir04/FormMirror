// formmirror/src/app/page.tsx
// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowRight, Target, Clock, Shield, Code, MousePointer,
  Zap, CheckCircle, Rocket, Menu, X, ArrowUp,Eye,
  BarChart3,TrendingUp, 
  Link
} from "lucide-react";

export default function FormMirrorLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Exit-intent – truly once per session
  useEffect(() => {
    if (typeof window === "undefined" || sessionStorage.getItem("exitIntentShown")) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && window.scrollY > 800) {
        setShowExitIntent(true);
        sessionStorage.setItem("exitIntentShown", "true");
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  return (
    <>
      {/* Trust Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-emerald-600 text-white text-center text-sm py-2.5 font-medium">
        2,847 marketers are tracking forms right now
      </div>

      {/* Navbar */}
      <nav className={`fixed top-10 left-4 right-4 z-40 transition-all ${scrolled ? "top-8" : "top-10"}`}>
        <div className={`max-w-6xl mx-auto  backdrop-blur-xl rounded-full shadow-lg border border-gray-200 px-6 py-4 flex items-center justify-between ${scrolled ? "bg-white/45" : "bg-white/95"}`}>
          <a href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">FormMirror</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {["Features", "Screens", "How It Works", "Pricing"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="text-gray-700 hover:text-violet-600 font-medium transition">
                {item}
              </a>
            ))}
            <a href="/auth/register" className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-2.5 rounded-full font-bold hover:shadow-lg transition">
              Start Free
            </a>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 bg-white rounded-2xl shadow-xl border p-6 text-center">
            {["Features", "Screens", "How It Works", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="block py-3 text-gray-700 font-medium hover:text-violet-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <a href="/auth/register" className="block mt-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-full font-bold">
              Start Free
            </a>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 text-center bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm mb-8">
            <Shield className="w-4 h-4" />
            GDPR Compliant • No Cookies • No Personal Data
          </div>

          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
            Stop Losing Leads to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400">
              Broken Forms
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto">
            Pinpoint exactly where users drop off. Fix friction in minutes.
            <strong className="block mt-3 text-emerald-300">Boost conversions up to 40% — without tracking people.</strong>
          </p>

          <a
            href="/auth/register"
            className="inline-flex items-center gap-3 bg-white text-violet-600 px-10 py-5 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all"
          >
            <Rocket className="w-6 h-6" />
            Start Free — No Card Required
            <ArrowRight className="w-5 h-5" />
          </a>

          <div className="flex flex-wrap justify-center gap-8 mt-10 text-gray-300">
            <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-400" /> Free forever</div>
            <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-400" /> Setup in 2 minutes</div>
            <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-400" /> 10,000+ forms tracked</div>
          </div>
        </div>
      </section>
      
      {/* Screenshots – Visual Proof */}
      <section id="screens" className="py-40 px-6 bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.3),transparent_50%)] opacity-70"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(196,181,253,0.2),transparent_50%)] opacity-50"></div>
        
        <div className="max-w-8xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-6 py-3 rounded-full text-sm mb-8 text-white/90">
              <Eye className="w-4 h-4" />
              Live Customer Dashboards
            </div>
            <h2 className="text-6xl md:text-7xl font-black mb-10 text-white leading-tight">
              Watch Users
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400">
                Drop Off Live
              </span>
            </h2>
            <p className="text-2xl md:text-3xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Real analytics. Real results. Zero guesswork.
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 max-w-7xl mx-auto">
            
            {/* Main Dashboard - Large */}
            <div className="lg:col-span-6 lg:row-span-2 group">
              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden border border-white/20 hover:shadow-3xl transition-all duration-700 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative p-8">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-bold text-gray-700">LIVE DASHBOARD</span>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900">Complete Analytics Overview</h3>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                    <Image
                      src="/HeroSection.webp"
                      width={1349}
                      height={1244}
                      alt="FormMirror main dashboard showing conversion rates, drop-off analysis, and real-time form performance metrics"
                      className="w-full h-auto"
                      quality={90}
                      sizes="100vw" 
                      priority
                      unoptimized={false}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights - Top Right */}
            <div className="lg:col-span-6 group">
              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden border border-white/20 hover:shadow-3xl transition-all duration-700 hover:scale-[1.02] h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative p-6 h-full flex flex-col">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-gray-700">AI POWERED</span>
                    </div>
                    <h3 className="text-lg font-black text-gray-900">Smart Detection</h3>
                  </div>
                  <div className="flex-1 relative rounded-xl overflow-hidden shadow-xl border-2 border-white">
                    <Image
                      src="/Features & Insights.webp"
                      width={1349}
                      height={640}
                      alt="AI-powered form analysis automatically detecting friction points and user behavior patterns"
                      className="w-full h-full object-cover"  
                      quality={90}
                      sizes="100vw"             
                      priority
                      unoptimized={false}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Analytics - Bottom Right */}
            <div className="lg:col-span-6 group">
              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden border border-white/20 hover:shadow-3xl transition-all duration-700 hover:scale-[1.02] h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative p-6 h-full flex flex-col">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-rose-600" />
                      <span className="text-xs font-bold text-gray-700">FIELD LEVEL</span>
                    </div>
                    <h3 className="text-lg font-black text-gray-900">Precise Data</h3>
                  </div>
                  <div className="flex-1 relative rounded-xl overflow-hidden shadow-xl border-2 border-white">
                    <Image
                      src="/Detailed Analytics.webp"
                      width={1349}
                      height={1499}
                      alt="Detailed field-by-field analytics showing time spent, rage clicks, and exact abandonment points"
                      className="w-full h-full object-cover"
                      quality={90}
                      sizes="100vw"            
                      priority
                      unoptimized={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-5xl mx-auto">
            {[
              { stat: "92%", label: "Accuracy", color: "from-violet-500 to-purple-500", icon: Target },
              { stat: "+40%", label: "Conversion Lift", color: "from-emerald-500 to-teal-500", icon: TrendingUp },
              { stat: "90s", label: "Setup Time", color: "from-blue-500 to-indigo-500", icon: Clock },
              { stat: "100%", label: "Privacy Safe", color: "from-rose-500 to-pink-500", icon: Shield }
            ].map((item, i) => (
              <div key={i} className="group">
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-500 hover:scale-105">
                  <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-black text-white mb-1">{item.stat}</div>
                  <div className="text-sm text-white/70 font-medium">{item.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-white/60 text-lg">
              ✨ Live data from 2,847+ active customers
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-6 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 to-indigo-50/30"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-8 text-gray-900 leading-tight">
              Privacy-First Analytics
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
                That Actually Work
              </span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
              No cookies. No PII. Just results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: "Pinpoint Exact Drop-Off Fields", desc: "Know the exact field killing your conversions — down to the second.", color: "from-violet-500 to-purple-600", hoverColor: "from-violet-600 to-purple-600", borderColor: "hover:border-violet-200" },
              { icon: Clock, title: "Time-on-Field Heatmaps", desc: "See where users hesitate, rage-click, or abandon — even if they never submit.", color: "from-emerald-500 to-teal-600", hoverColor: "from-emerald-600 to-teal-600", borderColor: "hover:border-emerald-200" },
              { icon: Shield, title: "100% Privacy Compliant", desc: "GDPR, CCPA, PECR ready. No consent banners needed.", color: "from-rose-500 to-pink-600", hoverColor: "from-rose-600 to-pink-600", borderColor: "hover:border-rose-200" },
            ].map((f, i) => (
              <div key={i} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${f.hoverColor} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <div className={`relative bg-white p-10 rounded-3xl shadow-xl border-2 border-gray-100 ${f.borderColor} transition-all duration-500 hover:shadow-2xl hover:-translate-y-2`}>
                  <div className={`w-20 h-20 bg-gradient-to-br ${f.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
                    <f.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">{f.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">3 Steps to 40% More Conversions</h2>
          <p className="text-xl text-gray-600 mb-16">From zero to insights in under 2 minutes</p>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { num: "1", title: "Add One Line of Code", code: '<script src="https://cdn.formmirror.com/tracker.js"></script>', icon: Code },
              { num: "2", title: "Select Your Form", code: "#contact-form", icon: MousePointer },
              { num: "3", title: "Watch Conversions Rise", code: "Live dashboard → instant insights", icon: Zap },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center text-3xl font-black text-white">
                  {step.num}
                </div>
                <step.icon className="w-12 h-12 mx-auto mb-6 text-violet-600" />
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <code className="bg-gray-200 px-4 py-2 rounded-lg text-sm font-mono">{step.code}</code>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-12">Real Results from Real Teams</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: "Increased form completions by 43% in 30 days", author: "Sarah Chen", role: "Growth Lead, TechCorp" },
              { quote: "Best privacy-first analytics tool we’ve ever used", author: "Marcus R.", role: "VP Marketing, CloudStack" },
              { quote: "Setup in 90 seconds. Results immediately.", author: "Emma T.", role: "PM, StartupXYZ" },
            ].map((t, i) => (
              <div key={i} className="bg-gray-50 p-8 rounded-2xl border">
                <p className="text-lg italic mb-6">“{t.quote}”</p>
                <p className="font-bold">{t.author}</p>
                <p className="text-sm text-gray-600">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Simple Pricing. Serious Results.</h2>
          <p className="text-xl text-gray-600 mb-16">Free forever. Upgrade only when you’re ready to scale.</p>

          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <div className="bg-white p-10 rounded-2xl border-2 border-gray-300">
              <h3 className="text-3xl font-black mb-4">Free</h3>
              <p className="text-5xl font-black mb-8">$0<span className="text-xl text-gray-500">/month</span></p>
              <ul className="text-left space-y-4 mb-10">
                {["3 projects", "7-day data", "Basic analytics", "Email support"].map((i) => (
                  <li key={i} className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-emerald-500" /> {i}</li>
                ))}
              </ul>
              <a href="/auth/register" className="block py-4 border-2 border-gray-400 rounded-xl font-bold hover:bg-gray-50 transition">
                Start Free
              </a>
            </div>

            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-10 rounded-2xl text-white shadow-2xl relative">
              <div className="absolute -top-4 right-8 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold">MOST POPULAR</div>
              <h3 className="text-3xl font-black mb-4">Pro</h3>
              <p className="text-5xl font-black mb-2">$29<span className="text-xl opacity-90">/month</span></p>
              <p className="opacity-90 mb-8">or $24/mo billed annually (save 17%)</p>
              <ul className="text-left space-y-4 mb-10">
                {["Unlimited projects", "90-day data", "Advanced heatmaps", "Real-time + API", "Priority support"].map((i) => (
                  <li key={i} className="flex items-center gap-3"><CheckCircle className="w-5 h-5" /> {i}</li>
                ))}
              </ul>
              <a href="/auth/register" className="block py-4 bg-white text-violet-600 rounded-xl font-bold hover:bg-gray-100 transition">
                Start Free Trial
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-violet-600 to-indigo-600 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Stop Guessing. Start Fixing.</h2>
          <p className="text-2xl mb-10">Join 2,847 marketers already boosting conversions</p>
          <a href="/auth/register" className="inline-flex items-center gap-3 bg-white text-violet-600 px-12 py-6 rounded-xl font-bold text-xl shadow-2xl hover:-translate-y-1 transition">
            <Rocket className="w-7 h-7" />
            Start Free — No Card Required
            <ArrowRight className="w-6 h-6" />
          </a>
        </div>
      </section>
      {/* Mini FAQ – For SEO + Trust */}
       <section className="py-20 px-4 bg-gray-50" id="faq">
        <div className="max-w-4xl mx-auto">
           <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Quick Questions</h2>
           <div className="space-y-5">
             {[
              {
                q: "Is FormMirror GDPR and CCPA compliant?",
                a: "Yes. We never collect IP addresses, cookies, or personally identifiable information (PII). No consent banner needed."
              },
              {
                q: "How does drop-off detection work without tracking users?",
                a: "We analyze anonymous interaction patterns — like time per field and navigation flow — using aggregated, non-identifiable data."
              },
              {
                q: "How do I add tracking?",
                a: "Copy the script from your dashboard and paste it into your site’s <head> or before </body>. Works with React, WordPress, Webflow, etc."
              },
              // ,
              // {
              //   q: "Can I use FormMirror with Google Analytics?",
              //   a: "Absolutely. FormMirror complements GA by providing field-level insights that GA can’t capture due to privacy restrictions."
              // }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border">
                <h3 className="font-bold text-gray-900">{item.q}</h3>
                <p className="text-gray-600 mt-2">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exit Intent Modal */}
      {showExitIntent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setShowExitIntent(false)}>
          <div className="bg-white rounded-2xl p-10 max-w-md text-center" onClick={e => e.stopPropagation()}>
            <h3 className="text-3xl font-black mb-4">Wait — Don’t Lose More Leads!</h3>
            <p className="text-lg text-gray-700 mb-8">Marketers using FormMirror see up to 40% higher conversions</p>
            <a href="/auth/register" className="block py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl mb-4">
              Start Free — No Card Required
            </a>
            <button onClick={() => setShowExitIntent(false)} className="text-gray-500 hover:text-gray-700">
              No thanks
            </button>
          </div>
        </div>
      )}

      {/* Scroll to Top */}
      {scrolled && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 p-4 bg-violet-600 text-white rounded-full shadow-2xl z-40 hover:bg-violet-700 transition"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      <footer className="py-12 text-center text-gray-500 text-sm border-t">
        © 2025 FormMirror • Privacy-first form analytics
      </footer>
    </>
  );
}

