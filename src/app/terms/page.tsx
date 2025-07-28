import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Terms of Service - FormMirror',
  description: 'Read FormMirror\'s terms of service to understand the terms and conditions for using our privacy-friendly form analytics platform.',
  keywords: 'terms of service, terms and conditions, formmirror terms, user agreement, service terms',
  openGraph: {
    title: 'Terms of Service - FormMirror',
    description: 'Read FormMirror\'s terms of service and user agreement.',
    url: 'https://formmirror.com/terms',
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image src="/logo.svg" alt="FormMirror logo" width={32} height={32} className="mr-3" />
                <span className="text-xl font-bold text-gray-900">FormMirror</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> January 15, 2024
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using FormMirror (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                FormMirror is a privacy-friendly form analytics platform that helps website owners track form interactions and improve conversion rates. Our service provides:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Anonymous form interaction tracking</li>
                <li>Conversion rate analytics</li>
                <li>Form abandonment insights</li>
                <li>Privacy-first data collection</li>
                <li>GDPR compliant analytics</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-700 mb-4">
                To use certain features of the Service, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and complete information</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use</h2>
              <p className="text-gray-700 mb-4">You agree not to use the Service to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit harmful, offensive, or inappropriate content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the Service&apos;s operation</li>
                <li>Use the Service for illegal or unethical purposes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Privacy and Data Protection</h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Our data collection and usage practices are outlined in our Privacy Policy, which is incorporated into these Terms by reference.
              </p>
              <p className="text-gray-700">
                We are committed to GDPR compliance and privacy-first analytics. We do not collect personal information or use cookies for tracking purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Service Availability</h2>
              <p className="text-gray-700 mb-4">
                We strive to maintain high service availability but cannot guarantee uninterrupted access. The Service may be temporarily unavailable due to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Scheduled maintenance</li>
                <li>Technical issues</li>
                <li>Force majeure events</li>
                <li>System updates</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Pricing and Payment</h2>
              <p className="text-gray-700 mb-4">
                FormMirror offers both free and paid plans. Pricing details are available on our website and may be updated from time to time.
              </p>
              <p className="text-gray-700 mb-4">
                For paid plans:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Payments are processed securely through third-party providers</li>
                <li>Subscriptions are billed in advance</li>
                <li>Refunds are handled according to our refund policy</li>
                <li>Price changes will be communicated in advance</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                The Service and its original content, features, and functionality are owned by FormMirror and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p className="text-gray-700">
                You retain ownership of any content you submit to the Service, but grant us a license to use it for service provision.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                In no event shall FormMirror, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Termination</h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including breach of these Terms.
              </p>
              <p className="text-gray-700">
                Upon termination, your right to use the Service will cease immediately, and we may delete your account and data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify these Terms at any time. We will notify users of any material changes via email or through the Service. Continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
              <p className="text-gray-700">
                These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <ul className="list-none text-gray-700">
                <li>Email: legal@formmirror.com</li>
                <li>Address: [Your Business Address]</li>
                <li>Website: https://formmirror.com</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
} 