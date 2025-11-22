'use client';

import Script from 'next/script';

export default function TrackingScript() {
  return (
    <Script
      src="/a1.js"
      strategy="afterInteractive"
      data-project-id={process.env.NEXT_PUBLIC_PROJECT_ID || "YOUR_PROJECT_ID"}
      defer
    />
  );
}