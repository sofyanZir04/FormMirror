import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FormMirror - Privacy-Friendly Form Analytics',
  description: 'Track form interactions and improve conversion rates with privacy-first analytics. No cookies, no personal data collection.',
  keywords: 'form analytics, conversion optimization, privacy-friendly, GDPR compliant, form tracking',
  authors: [{ name: 'FormMirror Team' }],
  creator: 'FormMirror',
  publisher: 'FormMirror',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://formmirror.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'FormMirror - Privacy-Friendly Form Analytics',
    description: 'Track form interactions and improve conversion rates with privacy-first analytics. No cookies, no personal data collection.',
    url: 'https://formmirror.com',
    siteName: 'FormMirror',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FormMirror - Privacy-Friendly Form Analytics',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FormMirror - Privacy-Friendly Form Analytics',
    description: 'Track form interactions and improve conversion rates with privacy-first analytics. No cookies, no personal data collection.',
    images: ['/og-image.png'],
    creator: '@formmirror',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#3b82f6" />
        
        {/* Privacy-friendly analytics placeholder */}
        <script defer data-domain="formmirror.com" src="https://plausible.io/js/script.js"></script>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}
