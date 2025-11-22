'use client';

import Script from 'next/script';

export default function TrackingScript() {
  return (
    <Script
      id="ui-layout-loader"
      // Load the script via the camouflaged URL (rewritten to /a1.js)
      src="/static/js/ui-layout.js"
    //   src="https://formmirror.vercel.app/_next/static/js/ui-layout.js"
      strategy="afterInteractive"
      defer
    />
  );
}
