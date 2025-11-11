// components/LemonScript.tsx
'use client';

import Script from 'next/script';
import { useEffect } from 'react';

export default function LemonScript() {
  useEffect(() => {
    // Optional: Initialize immediately if already loaded
    if (typeof (window as any).createLemonSqueezy === 'function') {
      (window as any).createLemonSqueezy();
    }
  }, []);

  return (
    <Script
      src="https://assets.lemonsqueezy.com/lemon.js"
      strategy="beforeInteractive"
      onLoad={() => {
        console.log('Lemon.js loaded');
        (window as any).createLemonSqueezy?.();
      }}
      onError={(e) => {
        console.error('Failed to load Lemon.js', e);
      }}
    />
  );
}