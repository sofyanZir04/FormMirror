import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'react-hot-toast'
import LemonSqueezyScript from './LemonSqueezyScript';

const inter = Inter({ subsets: ['latin'] })

// ✅ Clean base URL (no trailing spaces!)
const APP_URL = 'https://formmirror.com'

export const metadata: Metadata = {
  title: {
    default: 'FormMirror - Privacy-Friendly Form Analytics | Track Form Interactions',
    template: '%s | FormMirror'
  },
  description: 'Track form interactions and improve conversion rates with privacy-first analytics. No cookies, no personal data collection. GDPR compliant form tracking for better user experience.',
  keywords: [
    'form analytics',
    'conversion optimization', 
    'privacy-friendly analytics',
    'GDPR compliant',
    'form tracking',
    'user behavior analytics',
    'form optimization',
    'conversion rate optimization',
    'privacy-first analytics',
    'form performance',
    'user experience analytics',
    'form abandonment tracking'
  ].join(', '),
  authors: [{ name: 'FormMirror Team' }],
  creator: 'FormMirror',
  publisher: 'FormMirror',
  category: 'Technology',
  classification: 'Web Analytics',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(APP_URL), // ✅ Clean
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'FormMirror - Privacy-Friendly Form Analytics',
    description: 'Track form interactions and improve conversion rates with privacy-first analytics. No cookies, no personal data collection.',
    url: APP_URL, // ✅ Clean
    siteName: 'FormMirror',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FormMirror - Privacy-Friendly Form Analytics Dashboard',
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
    site: '@formmirror',
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
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  other: {
    'msapplication-TileColor': '#3b82f6',
    'msapplication-config': '/browserconfig.xml',
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.svg'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>          
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          
          {/* Favicon */}
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="theme-color" content="#000000" />

          {/* Structured Data - Schema.org */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org", // ✅ No spaces
                "@type": "SoftwareApplication",
                "name": "FormMirror",
                "description": "Privacy-friendly form analytics platform that tracks form interactions without invading user privacy",
                "url": APP_URL, // ✅ Clean
                "applicationCategory": "WebApplication",
                "operatingSystem": "Web Browser",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD",
                  "description": "Free tier available"
                },
                "author": {
                  "@type": "Organization",
                  "name": "FormMirror"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.8",
                  "ratingCount": "150"
                }
              })
            }}
          />
        </head>
        <body className={inter.className}>
          
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster position="top-right" />        
    
        </body>
        <LemonSqueezyScript/>
      </html>
    </>
  )
}
