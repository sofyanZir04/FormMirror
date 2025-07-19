import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
// import './globals.css' // Remove local Tailwind import

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FormMirror - Privacy-friendly Form Analytics',
  description: 'Analyze form interactions and optimize conversions without invasive tracking',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Import ClientLayout only in the body (client boundary)
  const ClientLayout = require('./client-layout').default
  return (
    <html lang="en">
      <head>
        {/* Tailwind CDN fallback */}
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
        {/* SEO Meta Tags */}
        <title>FormMirror - Privacy-friendly Form Analytics</title>
        <meta name="description" content="Analyze form interactions and optimize conversions without invasive tracking." />
        <meta property="og:title" content="FormMirror - Privacy-friendly Form Analytics" />
        <meta property="og:description" content="Analyze form interactions and optimize conversions without invasive tracking." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://formmirror.com" />
        <meta property="og:image" content="/file.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FormMirror - Privacy-friendly Form Analytics" />
        <meta name="twitter:description" content="Analyze form interactions and optimize conversions without invasive tracking." />
        <meta name="twitter:image" content="/file.svg" />
        {/* Favicon */}
        <link rel="icon" href="/file.svg" type="image/svg+xml" />
        {/* Plausible Analytics (placeholder) */}
        {/* <script async defer data-domain="formmirror.com" src="https://plausible.io/js/plausible.js"></script> */}
      </head>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
