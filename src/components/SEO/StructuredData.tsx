'use client'

import { useEffect } from 'react'

interface StructuredDataProps {
  data: Record<string, any>
}

export default function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
    // Add structured data to the page
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(data)
    document.head.appendChild(script)

    return () => {
      // Cleanup
      document.head.removeChild(script)
    }
  }, [data])

  return null
}

// Predefined structured data schemas
export const schemas = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FormMirror",
    "url": "https://formmirror.com",
    "logo": "https://formmirror.com/logo.png",
    "description": "Privacy-friendly form analytics platform",
    "sameAs": [
      "https://twitter.com/formmirror",
      "https://linkedin.com/company/formmirror"
    ]
  },
  
  softwareApplication: {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "FormMirror",
    "description": "Privacy-friendly form analytics platform that tracks form interactions without invading user privacy",
    "url": "https://formmirror.com",
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
  },
  
  faqPage: (faqs: Array<{ question: string; answer: string }>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }),
  
  breadcrumbList: (items: Array<{ name: string; url: string }>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  })
} 