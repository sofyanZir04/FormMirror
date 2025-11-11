import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, CheckCircle, Lock, Globe, Mail, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service - FormMirror',
  description: 'Read FormMirror\'s terms of service and understand how we protect your privacy and data.',
  keywords: 'terms of service, privacy, GDPR, form analytics, user agreement',
  openGraph: {
    title: 'Terms of Service - FormMirror',
    description: 'We protect your data. Always. No cookies. No tracking. Just analytics.',
    url: 'https://formmirror.com/terms',
    type: 'website',
  },
}

export default function TermsPage() {
  const lastUpdated = "January 15, 2024"

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
            <Link
              href="/auth/register"
              className="hidden sm:inline-flex items-center bg-white text-violet-600 px-5 py-2 rounded-xl font-bold hover:bg-gray-100 transition"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-black mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We protect your data. Always. No cookies. No tracking. Just privacy-first analytics.
          </p>
          <p className="text-sm text-gray-400 mt-4">
            Last updated: <span className="text-white">{lastUpdated}</span>
          </p>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: CheckCircle, label: "GDPR Compliant" },
            { icon: Lock, label: "SOC 2 Type II" },
            { icon: Globe, label: "EU Data Centers" },
            { icon: Shield, label: "10,000+ Users" },
          ].map((badge, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <badge.icon className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-medium">{badge.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
          <div className="prose prose-invert prose-lg max-w-none space-y-12">
            {[
              {
                num: "1",
                title: "Acceptance of Terms",
                content: "By using FormMirror, you agree to these terms. If you don’t, please don’t use our service. We keep it simple: you own your data, we protect it."
              },
              {
                num: "2",
                title: "What We Do",
                content: "FormMirror is a privacy-first form analytics platform. We track form interactions — never users. No cookies. No personal data. Just insights to improve your forms.",
                list: [
                  "Anonymous interaction tracking",
                  "Conversion & abandonment analytics",
                  "GDPR & CCPA compliant by default",
                  "No cookies or fingerprinting"
                ]
              },
              {
                num: "3",
                title: "Your Account",
                content: "You’re responsible for your account. Keep your password safe. Tell us immediately if you suspect unauthorized access."
              },
              {
                num: "4",
                title: "What You Can’t Do",
                content: "Don’t use FormMirror to break laws, spam, hack, or harm others. We’ll terminate accounts that violate this — no warning."
              },
              {
                num: "5",
                title: "Privacy Promise",
                content: "We don’t collect personal data. We don’t sell data. We don’t track users. Read our <Link href='/privacy' className='text-violet-400 hover:text-violet-300 underline'>Privacy Policy</Link> for full details."
              },
              {
                num: "6",
                title: "Service Availability",
                content: "We aim for 99.9% uptime. But we can’t guarantee it. Maintenance, bugs, or acts of God may cause downtime. We’ll do our best to minimize it."
              },
              {
                num: "7",
                title: "Pricing & Payment",
                content: "Free plan: limited. Paid plans: billed monthly or annually. No hidden fees. Cancel anytime. Refunds within 14 days."
              },
              {
                num: "8",
                title: "Intellectual Property",
                content: "FormMirror owns the platform. You own your data and forms. We get a license to process your data to provide the service."
              },
              {
                num: "9",
                title: "Limitation of Liability",
                content: "We’re not liable for indirect damages. Our total liability won’t exceed what you paid us in the last 12 months."
              },
              {
                num: "10",
                title: "Termination",
                content: "We can suspend or terminate your account for any reason. You can delete your account anytime."
              },
              {
                num: "11",
                title: "Changes to Terms",
                content: "We may update these terms. We’ll notify you via email or in-app. Continued use = acceptance."
              },
              {
                num: "12",
                title: "Governing Law",
                content: "These terms are governed by the laws of the Netherlands. Disputes go to Amsterdam courts."
              },
              {
                num: "13",
                title: "Contact Us",
                content: (
                  <div className="space-y-2 not-prose">
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <a href="mailto:legal@formmirror.com" className="text-violet-400 hover:text-violet-300">legal@formmirror.com</a>
                    </p>
                    <p>FormMirror B.V.</p>
                    <p>Keizersgracht 123, 1015 CJ Amsterdam, Netherlands</p>
                  </div>
                )
              },
            ].map((section, i) => (
              <section key={i}>
                <h2 className="text-2xl font-black flex items-center gap-3 mb-4">
                  <span className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center text-lg">
                    {section.num}
                  </span>
                  {section.title}
                </h2>
                <div className="text-gray-300 space-y-3">
                  <p>{section.content}</p>
                  {section.list && (
                    <ul className="space-y-2 ml-6">
                      {section.list.map((item, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-3xl font-black mb-4">Ready to Track Forms Privately?</h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Start free. No credit card. No cookies. Just real insights.
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
    </div>
  )
}

// import type { Metadata } from 'next'
// import Link from 'next/link'
// import Image from 'next/image'

// export const metadata: Metadata = {
//   title: 'Terms of Service - FormMirror',
//   description: 'Read FormMirror\'s terms of service to understand the terms and conditions for using our privacy-friendly form analytics platform.',
//   keywords: 'terms of service, terms and conditions, formmirror terms, user agreement, service terms',
//   openGraph: {
//     title: 'Terms of Service - FormMirror',
//     description: 'Read FormMirror\'s terms of service and user agreement.',
//     url: 'https://formmirror.com/terms',
//   },
// }

// export default function TermsPage() {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Navigation */}
//       <nav className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               <Link href="/" className="flex items-center">
//                 <Image src="/logo.svg" alt="FormMirror logo" width={32} height={32} className="mr-3" />
//                 <span className="text-xl font-bold text-gray-900">FormMirror</span>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Content */}
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="bg-white rounded-lg shadow-sm p-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
//           <div className="prose prose-lg max-w-none">
//             <p className="text-gray-600 mb-6">
//               <strong>Last updated:</strong> January 15, 2024
//             </p>

//             <section className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
//               <p className="text-gray-700 mb-4">
//                 By accessing and using FormMirror (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
//               </p>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
//               <p className="text-gray-700 mb-4">
//                 FormMirror is a privacy-friendly form analytics platform that helps website owners track form interactions and improve conversion rates. Our service provides:
//               </p>
//               <ul className="list-disc pl-6 text-gray-700 mb-4">
//                 <li>Anonymous form interaction tracking</li>
//                 <li>Conversion rate analytics</li>
//                 <li>Form abandonment insights</li>
//                 <li>Privacy-first data collection</li>
//                 <li>GDPR compliant analytics</li>
//               </ul>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
//               <p className="text-gray-700 mb-4">
//                 To use certain features of the Service, you must create an account. You are responsible for:
//               </p>
//               <ul className="list-disc pl-6 text-gray-700 mb-4">
//                 <li>Maintaining the confidentiality of your account credentials</li>
//                 <li>All activities that occur under your account</li>
//                 <li>Providing accurate and complete information</li>
//                 <li>Notifying us immediately of any unauthorized use</li>
//               </ul>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use</h2>
//               <p className="text-gray-700 mb-4">You agree not to use the Service to:</p>
//               <ul className="list-disc pl-6 text-gray-700 mb-4">
//                 <li>Violate any applicable laws or regulations</li>
//                 <li>Infringe on intellectual property rights</li>
//                 <li>Transmit harmful, offensive, or inappropriate content</li>
//                 <li>Attempt to gain unauthorized access to our systems</li>
//                 <li>Interfere with the Service&apos;s operation</li>
//                 <li>Use the Service for illegal or unethical purposes</li>
//               </ul>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Privacy and Data Protection</h2>
//               <p className="text-gray-700 mb-4">
//                 Your privacy is important to us. Our data collection and usage practices are outlined in our Privacy Policy, which is incorporated into these Terms by reference.
//               </p>
//               <p className="text-gray-700">
//                 We are committed to GDPR compliance and privacy-first analytics. We do not collect personal information or use cookies for tracking purposes.
//               </p>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Service Availability</h2>
//               <p className="text-gray-700 mb-4">
//                 We strive to maintain high service availability but cannot guarantee uninterrupted access. The Service may be temporarily unavailable due to:
//               </p>
//               <ul className="list-disc pl-6 text-gray-700 mb-4">
//                 <li>Scheduled maintenance</li>
//                 <li>Technical issues</li>
//                 <li>Force majeure events</li>
//                 <li>System updates</li>
//               </ul>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Pricing and Payment</h2>
//               <p className="text-gray-700 mb-4">
//                 FormMirror offers both free and paid plans. Pricing details are available on our website and may be updated from time to time.
//               </p>
//               <p className="text-gray-700 mb-4">
//                 For paid plans:
//               </p>
//               <ul className="list-disc pl-6 text-gray-700 mb-4">
//                 <li>Payments are processed securely through third-party providers</li>
//                 <li>Subscriptions are billed in advance</li>
//                 <li>Refunds are handled according to our refund policy</li>
//                 <li>Price changes will be communicated in advance</li>
//               </ul>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Intellectual Property</h2>
//               <p className="text-gray-700 mb-4">
//                 The Service and its original content, features, and functionality are owned by FormMirror and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
//               </p>
//               <p className="text-gray-700">
//                 You retain ownership of any content you submit to the Service, but grant us a license to use it for service provision.
//               </p>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
//               <p className="text-gray-700 mb-4">
//                 In no event shall FormMirror, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
//               </p>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Termination</h2>
//               <p className="text-gray-700 mb-4">
//                 We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including breach of these Terms.
//               </p>
//               <p className="text-gray-700">
//                 Upon termination, your right to use the Service will cease immediately, and we may delete your account and data.
//               </p>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to Terms</h2>
//               <p className="text-gray-700">
//                 We reserve the right to modify these Terms at any time. We will notify users of any material changes via email or through the Service. Continued use of the Service after changes constitutes acceptance of the new Terms.
//               </p>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
//               <p className="text-gray-700">
//                 These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
//               </p>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
//               <p className="text-gray-700 mb-4">
//                 If you have any questions about these Terms of Service, please contact us:
//               </p>
//               <ul className="list-none text-gray-700">
//                 <li>Email: legal@formmirror.com</li>
//                 <li>Address: [Your Business Address]</li>
//                 <li>Website: https://formmirror.com</li>
//               </ul>
//             </section>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// } 