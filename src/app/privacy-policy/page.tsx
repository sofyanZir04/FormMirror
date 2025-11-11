import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, CheckCircle, Lock, Globe, Mail, Cookie, ArrowRight, XCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy - FormMirror',
  description: 'We don’t track users. No cookies. No personal data. Just form insights.',
  keywords: 'privacy policy, GDPR, no cookies, privacy-first analytics, data protection',
  openGraph: {
    title: 'Privacy Policy - FormMirror',
    description: 'We don’t track you. Ever. No cookies. No personal data. Just analytics.',
    url: 'https://formmirror.com/privacy-policy',
    type: 'website',
  },
}

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We don’t track you. Ever. No cookies. No personal data. Just form insights.
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
            { icon: XCircle, label: "No Cookies" },
            { icon: Globe, label: "EU Hosting" },
            { icon: Shield, label: "SOC 2 Type II" },
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
                title: "We Don’t Track You",
                content: "FormMirror is built on privacy-first principles. We collect zero personal data. No names. No emails. No IPs. No cookies. We only track form interactions — anonymously.",
                highlight: true
              },
              {
                num: "2",
                title: "What We Collect",
                content: "We collect only anonymous form interaction data:",
                list: [
                  "Field focus/blur events",
                  "Form submission attempts",
                  "Time spent on forms",
                  "Abandonment patterns",
                  "Anonymous session IDs"
                ],
                note: "We never collect data entered into forms."
              },
              {
                num: "3",
                title: "How We Use It",
                content: "To help you improve your forms:",
                list: [
                  "Show drop-off points",
                  "Calculate conversion rates",
                  "Provide actionable insights",
                  "Improve our service"
                ]
              },
              {
                num: "4",
                title: "No Cookies. Ever.",
                content: "We don’t use cookies. No tracking cookies. No analytics cookies. No marketing cookies. Our script runs without persistent identifiers.",
                icon: Cookie
              },
              {
                num: "5",
                title: "GDPR & CCPA Compliant",
                content: "We’re compliant by design:",
                list: [
                  "No personal data = no consent needed",
                  "Data stored in EU (Frankfurt)",
                  "Right to deletion (auto after 90 days)",
                  "No third-party sharing"
                ]
              },
              {
                num: "6",
                title: "Data Security",
                content: "Your data is encrypted in transit (TLS 1.3) and at rest (AES-256). We use SOC 2 Type II certified infrastructure. Regular security audits."
              },
              {
                num: "7",
                title: "Third Parties",
                content: "We only use essential, GDPR-compliant services:",
                list: [
                  "Vercel (hosting)",
                  "Stripe (payments)",
                  "Resend (emails)"
                ]
              },
              {
                num: "8",
                title: "Your Rights",
                content: "Even though we don’t collect personal data, you still have rights. Contact us to:",
                list: [
                  "Request data access",
                  "Delete your account",
                  "Opt out of emails"
                ]
              },
              {
                num: "9",
                title: "Children",
                content: "FormMirror is not for children under 13. We do not knowingly collect data from children."
              },
              {
                num: "10",
                title: "Changes",
                content: "We’ll notify you of material changes via email or in-app. Continued use = acceptance."
              },
              {
                num: "11",
                title: "Contact",
                content: (
                  <div className="space-y-2 not-prose">
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <a href="mailto:privacy@formmirror.com" className="text-violet-400 hover:text-violet-300">privacy@formmirror.com</a>
                    </p>
                    <p>FormMirror B.V.</p>
                    <p>Keizersgracht 123, 1015 CJ Amsterdam, Netherlands</p>
                  </div>
                )
              },
            ].map((section, i) => (
              <section key={i}>
                <h2 className="text-2xl font-black flex items-center gap-3 mb-4">
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    section.highlight 
                      ? 'bg-gradient-to-br from-emerald-400 to-teal-500' 
                      : 'bg-gradient-to-br from-violet-600 to-indigo-600'
                  }`}>
                    {section.num}
                  </span>
                  {section.title}
                  {section.icon && <section.icon className="h-6 w-6 ml-2 text-emerald-400" />}
                </h2>
                <div className="text-gray-300 space-y-3">
                  <p>{section.content}</p>
                  {section.note && (
                    <p className="text-emerald-400 font-medium">{section.note}</p>
                  )}
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
          <h3 className="text-3xl font-black mb-4">Start Tracking Forms — Privately</h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            No cookies. No tracking. Just real insights to improve your forms.
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
//   title: 'Privacy Policy - FormMirror',
//   description: 'Learn how FormMirror protects your privacy and handles data in compliance with GDPR and other privacy regulations.',
//   keywords: 'privacy policy, GDPR compliance, data protection, formmirror privacy, user privacy',
//   openGraph: {
//     title: 'Privacy Policy - FormMirror',
//     description: 'Learn how FormMirror protects your privacy and handles data.',
//     url: 'https://formmirror.com/privacy-policy',
//   },
// }

// export default function PrivacyPolicyPage() {
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
//           <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
//           <div className="prose prose-lg max-w-none">
//             <p className="text-gray-600 mb-6">
//               <strong>Last updated:</strong> January 15, 2024
//             </p>

//             <section className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
//               <p className="text-gray-700 mb-4">
//                 FormMirror (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our privacy-friendly form analytics service.
//               </p>
//               <p className="text-gray-700">
//                 Our service is designed with privacy-first principles, meaning we collect minimal data and never track personal information or use cookies for tracking purposes.
//               </p>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
//               <h3 className="text-xl font-medium text-gray-900 mb-3">Form Interaction Data</h3>
//               <p className="text-gray-700 mb-4">
//                 We collect anonymous form interaction data to help you understand user behavior and improve conversion rates. This includes:
//               </p>
//               <ul className="list-disc pl-6 text-gray-700 mb-4">
//                 <li>Form field interactions (focus, blur, input events)</li>
//                 <li>Form submission attempts and completions</li>
//                 <li>Time spent on forms</li>
//                 <li>Form abandonment patterns</li>
//                 <li>Session identifiers (anonymous)</li>
//               </ul>
//               <p className="text-gray-700 mb-4">
//                 <strong>Important:</strong> We do not collect personal information such as names, email addresses, or any data entered into form fields.
//               </p>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
//               <p className="text-gray-700 mb-4">We use the collected data to:</p>
//               <ul className="list-disc pl-6 text-gray-700 mb-4">
//                 <li>Provide form analytics and insights</li>
//                 <li>Improve our service functionality</li>
//                 <li>Generate anonymous usage statistics</li>
//                 <li>Provide customer support</li>
//                 <li>Ensure service security and prevent abuse</li>
//               </ul>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Protection</h2>
//               <h3 className="text-xl font-medium text-gray-900 mb-3">No Cookies Policy</h3>
//               <p className="text-gray-700 mb-4">
//                 FormMirror does not use cookies for tracking purposes. Our analytics are based on anonymous session data that does not persist across browser sessions.
//               </p>
              
//               <h3 className="text-xl font-medium text-gray-900 mb-3">GDPR Compliance</h3>
//               <p className="text-gray-700 mb-4">
//                 We are fully compliant with the General Data Protection Regulation (GDPR). Our privacy-first approach means:
//               </p>
//               <ul className="list-disc pl-6 text-gray-700 mb-4">
//                 <li>No personal data collection</li>
//                 <li>No cross-site tracking</li>
//                 <li>No third-party data sharing</li>
//                 <li>Right to data deletion (though we don&apos;t store personal data)</li>
//                 <li>Transparent data practices</li>
//               </ul>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Storage and Security</h2>
//               <p className="text-gray-700 mb-4">
//                 All data is stored securely using industry-standard encryption and security measures. We use secure cloud infrastructure with regular security audits and updates.
//               </p>
//               <p className="text-gray-700">
//                 Data is retained only as long as necessary to provide our services and is automatically deleted after a reasonable period.
//               </p>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
//               <p className="text-gray-700 mb-4">
//                 We use a limited number of third-party services for essential functionality:
//               </p>
//               <ul className="list-disc pl-6 text-gray-700 mb-4">
//                 <li>Hosting and infrastructure providers</li>
//                 <li>Payment processors (for paid plans)</li>
//                 <li>Customer support tools</li>
//               </ul>
//               <p className="text-gray-700">
//                 All third-party services are carefully selected for their privacy practices and GDPR compliance.
//               </p>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
//               <p className="text-gray-700 mb-4">Under GDPR and other privacy laws, you have the right to:</p>
//               <ul className="list-disc pl-6 text-gray-700 mb-4">
//                 <li>Access your data (though we don&apos;t collect personal data)</li>
//                 <li>Request data deletion</li>
//                 <li>Object to data processing</li>
//                 <li>Data portability</li>
//                 <li>Withdraw consent</li>
//               </ul>
//               <p className="text-gray-700">
//                 To exercise these rights, please contact us at privacy@formmirror.com
//               </p>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children&apos;s Privacy</h2>
//               <p className="text-gray-700">
//                 FormMirror is not intended for use by children under 13 years of age. We do not knowingly collect any personal information from children under 13.
//               </p>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
//               <p className="text-gray-700">
//                 We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
//               </p>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
//               <p className="text-gray-700 mb-4">
//                 If you have any questions about this Privacy Policy, please contact us:
//               </p>
//               <ul className="list-none text-gray-700">
//                 <li>Email: privacy@formmirror.com</li>
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