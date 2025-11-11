import type { Metadata } from 'next'
import HelpContent from './HelpContent'

export const metadata: Metadata = {
  title: 'Help & Docs - FormMirror',
  description: 'Get started in 60 seconds. Full docs, FAQs, and support for privacy-first form analytics.',
  keywords: 'help, docs, support, form analytics, privacy, GDPR, no cookies',
  openGraph: {
    title: 'Help & Docs - FormMirror',
    description: 'Get unstuck in 60 seconds. Full docs, FAQs, and support.',
    url: 'https://formmirror.com/help', // لاحظ إزالة المسافة الزائدة
    type: 'website',
  },
}


export default function HelpPage() {
  return <HelpContent />
}


// import type { Metadata } from 'next'
// import HelpContent from './HelpContent.tsx'

// export const metadata: Metadata = {
//   title: 'Help & Docs - FormMirror',
//   description: 'Get started in 60 seconds. Full docs, FAQs, and support for privacy-first form analytics.',
//   keywords: 'help, docs, support, form analytics, privacy, GDPR, no cookies',
//   openGraph: {
//     title: 'Help & Docs - FormMirror',
//     description: 'Get unstuck in 60 seconds. Full docs, FAQs, and support.',
//     url: 'https://formmirror.com/help', // تأكد من إزالة أي مسافات زائدة
//     type: 'website',
//   },
// }

// export default function HelpPageWrapper() {
//   return <HelpContent />
// }

// import type { Metadata } from 'next'
// import Link from 'next/link'
// import Image from 'next/image'
// import { BookOpen, MessageCircle, Settings, Zap } from 'lucide-react'

// export const metadata: Metadata = {
//   title: 'Help & Documentation - FormMirror',
//   description: 'Get help with FormMirror. Find user guides, FAQs, and support resources for our privacy-friendly form analytics platform.',
//   keywords: 'help, documentation, support, formmirror help, user guide, FAQ, form analytics support',
//   openGraph: {
//     title: 'Help & Documentation - FormMirror',
//     description: 'Get help with FormMirror. Find user guides, FAQs, and support resources.',
//     url: 'https://formmirror.com/help',
//   },
// }

// export default function HelpPage() {
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
//             <div className="flex items-center space-x-4">
//               <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 transition">
//                 Sign In
//               </Link>
//               <Link
//                 href="/auth/register"
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
//               >
//                 Get Started
//               </Link>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <div className="bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//           <div className="text-center">
//             <h1 className="text-4xl font-bold text-gray-900 mb-4">
//               Help & Documentation
//             </h1>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Everything you need to get started with FormMirror and make the most of our privacy-friendly form analytics.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Quick Links */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
//           <Link href="#getting-started" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center mb-4">
//               <Zap className="h-8 w-8 text-blue-600 mr-3" />
//               <h3 className="text-lg font-semibold">Getting Started</h3>
//             </div>
//             <p className="text-gray-600">Quick setup guide for new users</p>
//           </Link>

//           <Link href="#user-guide" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center mb-4">
//               <BookOpen className="h-8 w-8 text-green-600 mr-3" />
//               <h3 className="text-lg font-semibold">User Guide</h3>
//             </div>
//             <p className="text-gray-600">Complete feature documentation</p>
//           </Link>

//           <Link href="#faq" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center mb-4">
//               <MessageCircle className="h-8 w-8 text-purple-600 mr-3" />
//               <h3 className="text-lg font-semibold">FAQ</h3>
//             </div>
//             <p className="text-gray-600">Frequently asked questions</p>
//           </Link>

//           <Link href="#support" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center mb-4">
//               <Settings className="h-8 w-8 text-orange-600 mr-3" />
//               <h3 className="text-lg font-semibold">Support</h3>
//             </div>
//             <p className="text-gray-600">Get help from our team</p>
//           </Link>
//         </div>

//         {/* Getting Started Section */}
//         <section id="getting-started" className="mb-16">
//           <h2 className="text-3xl font-bold text-gray-900 mb-8">Getting Started</h2>
//           <div className="bg-white rounded-lg shadow-sm p-8">
//             <div className="space-y-8">
//               <div>
//                 <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Create Your Account</h3>
//                 <p className="text-gray-600 mb-4">
//                   Sign up for a free FormMirror account. No credit card required to get started.
//                 </p>
//                 <Link href="/auth/register" className="inline-flex items-center text-blue-600 hover:text-blue-700">
//                   Sign up now →
//                 </Link>
//               </div>

//               <div>
//                 <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Create Your First Project</h3>
//                 <p className="text-gray-600 mb-4">
//                   After signing in, create a new project to start tracking form interactions.
//                 </p>
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <p className="text-sm text-gray-600">
//                     <strong>Tip:</strong> Give your project a descriptive name that helps you identify it later.
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Add Tracking Code</h3>
//                 <p className="text-gray-600 mb-4">
//                   Copy the tracking script and add it to your website. The script is lightweight and privacy-friendly.
//                 </p>
//                 <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm">
//                   &lt;script src=&quot;https://formmirror.com/track.js&quot; data-project-id=&quot;YOUR_PROJECT_ID&quot;&gt;&lt;/script&gt;
//                 </div>
//               </div>

//               <div>
//                 <h3 className="text-xl font-semibold text-gray-900 mb-4">4. View Analytics</h3>
//                 <p className="text-gray-600 mb-4">
//                   Start seeing form interaction data in your dashboard within minutes of adding the tracking code.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* User Guide Section */}
//         <section id="user-guide" className="mb-16">
//           <h2 className="text-3xl font-bold text-gray-900 mb-8">User Guide</h2>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             <div className="bg-white rounded-lg shadow-sm p-8">
//               <h3 className="text-xl font-semibold text-gray-900 mb-4">Dashboard Overview</h3>
//               <p className="text-gray-600 mb-4">
//                 Your dashboard shows key metrics about form performance, including:
//               </p>
//               <ul className="list-disc pl-6 text-gray-600 space-y-2">
//                 <li>Total form interactions</li>
//                 <li>Conversion rates</li>
//                 <li>Form abandonment patterns</li>
//                 <li>Field completion rates</li>
//                 <li>Session duration</li>
//               </ul>
//             </div>

//             <div className="bg-white rounded-lg shadow-sm p-8">
//               <h3 className="text-xl font-semibold text-gray-900 mb-4">Project Management</h3>
//               <p className="text-gray-600 mb-4">
//                 Organize your forms into projects for better tracking:
//               </p>
//               <ul className="list-disc pl-6 text-gray-600 space-y-2">
//                 <li>Create multiple projects</li>
//                 <li>Track different forms separately</li>
//                 <li>Compare performance across projects</li>
//                 <li>Manage team access</li>
//               </ul>
//             </div>

//             <div className="bg-white rounded-lg shadow-sm p-8">
//               <h3 className="text-xl font-semibold text-gray-900 mb-4">Privacy Features</h3>
//               <p className="text-gray-600 mb-4">
//                 FormMirror is built with privacy-first principles:
//               </p>
//               <ul className="list-disc pl-6 text-gray-600 space-y-2">
//                 <li>No personal data collection</li>
//                 <li>GDPR compliant by default</li>
//                 <li>No cookies required</li>
//                 <li>Anonymous session tracking</li>
//               </ul>
//             </div>

//             <div className="bg-white rounded-lg shadow-sm p-8">
//               <h3 className="text-xl font-semibold text-gray-900 mb-4">Advanced Analytics</h3>
//               <p className="text-gray-600 mb-4">
//                 Unlock advanced features with Pro plans:
//               </p>
//               <ul className="list-disc pl-6 text-gray-600 space-y-2">
//                 <li>Real-time analytics</li>
//                 <li>Custom event tracking</li>
//                 <li>Export data</li>
//                 <li>Advanced filtering</li>
//               </ul>
//             </div>
//           </div>
//         </section>

//         {/* FAQ Section */}
//         <section id="faq" className="mb-16">
//           <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
//           <div className="space-y-6">
//             <div className="bg-white rounded-lg shadow-sm p-8">
//               <h3 className="text-xl font-semibold text-gray-900 mb-4">Is FormMirror really privacy-friendly?</h3>
//               <p className="text-gray-600">
//                 Yes! FormMirror is designed with privacy-first principles. We don&apos;t collect personal information, 
//                 don&apos;t use cookies for tracking, and are fully GDPR compliant. We only track anonymous form 
//                 interactions to help you understand user behavior.
//               </p>
//             </div>

//             <div className="bg-white rounded-lg shadow-sm p-8">
//               <h3 className="text-xl font-semibold text-gray-900 mb-4">How does the tracking work?</h3>
//               <p className="text-gray-600">
//                 Our lightweight JavaScript snippet tracks form interactions like focus, blur, input, and submit events. 
//                 It doesn&apos;t capture the actual data entered into forms, only the interaction patterns. All data is 
//                 anonymized and aggregated.
//               </p>
//             </div>

//             <div className="bg-white rounded-lg shadow-sm p-8">
//               <h3 className="text-xl font-semibold text-gray-900 mb-4">What&apos;s the difference between Free and Pro plans?</h3>
//               <p className="text-gray-600">
//                 Free plans include basic analytics, up to 1,000 form interactions per month, and 30-day data retention. 
//                 Pro plans offer unlimited interactions, real-time analytics, custom events, data export, and priority support.
//               </p>
//             </div>

//             <div className="bg-white rounded-lg shadow-sm p-8">
//               <h3 className="text-xl font-semibold text-gray-900 mb-4">Can I export my data?</h3>
//               <p className="text-gray-600">
//                 Data export is available on Pro plans. You can export your analytics data in CSV format for 
//                 further analysis or integration with other tools.
//               </p>
//             </div>

//             <div className="bg-white rounded-lg shadow-sm p-8">
//               <h3 className="text-xl font-semibold text-gray-900 mb-4">How do I add tracking to my website?</h3>
//               <p className="text-gray-600">
//                 Simply copy the tracking script from your project dashboard and add it to your website&apos;s HTML. 
//                 The script should be placed in the &lt;head&gt; section or before the closing &lt;/body&gt; tag.
//               </p>
//             </div>

//             <div className="bg-white rounded-lg shadow-sm p-8">
//               <h3 className="text-xl font-semibold text-gray-900 mb-4">What if I need help with implementation?</h3>
//               <p className="text-gray-600">
//                 We offer comprehensive documentation, video tutorials, and email support. Pro users get 
//                 priority support and can request custom implementation assistance.
//               </p>
//             </div>
//           </div>
//         </section>

//         {/* Support Section */}
//         <section id="support" className="mb-16">
//           <h2 className="text-3xl font-bold text-gray-900 mb-8">Get Support</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div className="bg-white rounded-lg shadow-sm p-8">
//               <h3 className="text-xl font-semibold text-gray-900 mb-4">Email Support</h3>
//               <p className="text-gray-600 mb-4">
//                 Get help from our support team via email. We typically respond within 24 hours.
//               </p>
//               <a href="mailto:support@formmirror.com" className="text-blue-600 hover:text-blue-700">
//                 support@formmirror.com
//               </a>
//             </div>

//             <div className="bg-white rounded-lg shadow-sm p-8">
//               <h3 className="text-xl font-semibold text-gray-900 mb-4">Feedback</h3>
//               <p className="text-gray-600 mb-4">
//                 Share your feedback, feature requests, or report bugs through our feedback system.
//               </p>
//               <Link href="/dashboard/feedback" className="text-blue-600 hover:text-blue-700">
//                 Submit Feedback →
//               </Link>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   )
// } 