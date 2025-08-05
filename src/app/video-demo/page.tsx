import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Play, ArrowLeft, Download, Share2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Video Demo - FormMirror Analytics',
  description: 'Watch FormMirror in action with our comprehensive video demo. See how privacy-friendly form analytics work in real-time.',
  keywords: 'video demo, formmirror demo, form analytics demo, privacy-friendly analytics video',
  openGraph: {
    title: 'Video Demo - FormMirror Analytics',
    description: 'Watch FormMirror in action with our comprehensive video demo.',
    url: 'https://formmirror.com/video-demo',
  },
}

export default function VideoDemoPage() {
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
            <div className="flex items-center space-x-4">
              <Link href="/demo" className="text-gray-600 hover:text-gray-900 transition">
                Live Demo
              </Link>
              <Link href="/help" className="text-gray-600 hover:text-gray-900 transition">
                Help
              </Link>
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 transition">
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Link href="/demo" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Live Demo
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Watch FormMirror in Action
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how our privacy-friendly form analytics work in real-time. This comprehensive demo shows the complete setup process and dashboard features.
            </p>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Video Placeholder */}
          <div className="relative bg-gray-900 aspect-video">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="bg-blue-600 rounded-full p-6 mb-4 inline-block">
                  <Play className="h-12 w-12 text-white ml-1" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Video Demo Coming Soon
                </h3>
                <p className="text-gray-300 max-w-md">
                  We&apos;re creating a comprehensive video demo that shows FormMirror in action. 
                  Subscribe to be notified when it&apos;s ready!
                </p>
              </div>
            </div>
          </div>

          {/* Video Info */}
          <div className="p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Complete FormMirror Demo
                </h2>
                <p className="text-gray-600">
                  Duration: ~5 minutes • Updated: Coming soon
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </button>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
              </div>
            </div>

            {/* Video Chapters */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What you&apos;ll learn:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 rounded-full p-2 mt-1">
                    <span className="text-blue-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Quick Setup</h4>
                    <p className="text-sm text-gray-600">How to create a project and add tracking code</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 rounded-full p-2 mt-1">
                    <span className="text-blue-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Dashboard Overview</h4>
                    <p className="text-sm text-gray-600">Understanding your analytics dashboard</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 rounded-full p-2 mt-1">
                    <span className="text-blue-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Form Analytics</h4>
                    <p className="text-sm text-gray-600">Interpreting form interaction data</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 rounded-full p-2 mt-1">
                    <span className="text-blue-600 font-semibold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Privacy Features</h4>
                    <p className="text-sm text-gray-600">How we protect user privacy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alternative Demo Options */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Try Live Demo</h3>
            <p className="text-gray-600 mb-6">
              Experience FormMirror in real-time with our interactive demo. Fill out forms and see analytics update instantly.
            </p>
            <Link
              href="/demo"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Launch Live Demo
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Read Documentation</h3>
            <p className="text-gray-600 mb-6">
              Get detailed instructions and best practices for implementing FormMirror on your website.
            </p>
            <Link
              href="/help"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              View Documentation
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-blue-100 mb-6">
            Join thousands of developers and marketers who trust FormMirror for privacy-friendly form analytics.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 shadow-xl"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </div>
  )
} 