import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Privacy Policy - FormMirror',
  description: 'Learn how FormMirror protects your privacy and handles data in compliance with GDPR and other privacy regulations.',
  keywords: 'privacy policy, GDPR compliance, data protection, formmirror privacy, user privacy',
  openGraph: {
    title: 'Privacy Policy - FormMirror',
    description: 'Learn how FormMirror protects your privacy and handles data.',
    url: 'https://formmirror.com/privacy-policy',
  },
}

export default function PrivacyPolicyPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> January 15, 2024
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-700 mb-4">
                FormMirror (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our privacy-friendly form analytics service.
              </p>
              <p className="text-gray-700">
                Our service is designed with privacy-first principles, meaning we collect minimal data and never track personal information or use cookies for tracking purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Form Interaction Data</h3>
              <p className="text-gray-700 mb-4">
                We collect anonymous form interaction data to help you understand user behavior and improve conversion rates. This includes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Form field interactions (focus, blur, input events)</li>
                <li>Form submission attempts and completions</li>
                <li>Time spent on forms</li>
                <li>Form abandonment patterns</li>
                <li>Session identifiers (anonymous)</li>
              </ul>
              <p className="text-gray-700 mb-4">
                <strong>Important:</strong> We do not collect personal information such as names, email addresses, or any data entered into form fields.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">We use the collected data to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Provide form analytics and insights</li>
                <li>Improve our service functionality</li>
                <li>Generate anonymous usage statistics</li>
                <li>Provide customer support</li>
                <li>Ensure service security and prevent abuse</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Protection</h2>
              <h3 className="text-xl font-medium text-gray-900 mb-3">No Cookies Policy</h3>
              <p className="text-gray-700 mb-4">
                FormMirror does not use cookies for tracking purposes. Our analytics are based on anonymous session data that does not persist across browser sessions.
              </p>
              
              <h3 className="text-xl font-medium text-gray-900 mb-3">GDPR Compliance</h3>
              <p className="text-gray-700 mb-4">
                We are fully compliant with the General Data Protection Regulation (GDPR). Our privacy-first approach means:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>No personal data collection</li>
                <li>No cross-site tracking</li>
                <li>No third-party data sharing</li>
                <li>Right to data deletion (though we don&apos;t store personal data)</li>
                <li>Transparent data practices</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Storage and Security</h2>
              <p className="text-gray-700 mb-4">
                All data is stored securely using industry-standard encryption and security measures. We use secure cloud infrastructure with regular security audits and updates.
              </p>
              <p className="text-gray-700">
                Data is retained only as long as necessary to provide our services and is automatically deleted after a reasonable period.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                We use a limited number of third-party services for essential functionality:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Hosting and infrastructure providers</li>
                <li>Payment processors (for paid plans)</li>
                <li>Customer support tools</li>
              </ul>
              <p className="text-gray-700">
                All third-party services are carefully selected for their privacy practices and GDPR compliance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
              <p className="text-gray-700 mb-4">Under GDPR and other privacy laws, you have the right to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Access your data (though we don&apos;t collect personal data)</li>
                <li>Request data deletion</li>
                <li>Object to data processing</li>
                <li>Data portability</li>
                <li>Withdraw consent</li>
              </ul>
              <p className="text-gray-700">
                To exercise these rights, please contact us at privacy@formmirror.com
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children&apos;s Privacy</h2>
              <p className="text-gray-700">
                FormMirror is not intended for use by children under 13 years of age. We do not knowingly collect any personal information from children under 13.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-none text-gray-700">
                <li>Email: privacy@formmirror.com</li>
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