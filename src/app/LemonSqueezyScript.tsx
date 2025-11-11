'use client';

import Script from 'next/script';

export default function LemonSqueezyScript() {
  return (

    <Script
        src="https://app.lemonsqueezy.com/js/lemon.js"
        strategy="afterInteractive"
        onLoad={() => console.log('LemonSqueezy SDK loaded')}
        onError={() => console.warn('LemonSqueezy SDK failed to load - fallback will be used')}
    />

    // <Script
    //   src="https://app.lemonsqueezy.com/js/lemon.js"
    //   strategy="lazyOnload"
    //   onLoad={() => {
    //     console.log('LemonSqueezy script loaded');
    //     if (typeof window !== 'undefined' && (window as any).createLemonSqueezy) {
    //       (window as any).createLemonSqueezy();
    //     }
    //   }}
    //   onError={(e) => {
    //     console.error('Failed to load LemonSqueezy script:', e);
    //   }}
    // />
  );
}