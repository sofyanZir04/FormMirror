// next.config.ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ESLint ignore during build (Vercel-friendly)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // CRITICAL: Allow CORS for tracking endpoint + keep your CSP safe
  async headers() {
    return [
      // 1. Favicon cache
      {
        source: '/favicon.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },

      // 2. Global CSP (safe for your app)
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.lemonsqueezy.com https://assets.lemonsqueezy.com 'wasm-unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "frame-src https://checkout.lemonsqueezy.com",
              // connect-src includes your Supabase + Lemon + tracking endpoint
              "connect-src 'self' https://app.lemonsqueezy.com https://checkout.lemonsqueezy.com https://dzxvhnmtomanwiqsnanw.supabase.co https://assets.lemonsqueezy.com https://formmirror.vercel.app",
            ].join('; '),
          },
        ],
      },

      // 3. THE MAGIC: Dedicated CORS headers for /api/track (bypasses Vercel's default block)
      {
        source: '/api/track',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
          { key: 'Access-Control-Max-Age', value: '86400' },
        ],
      },
    ];
  },

  // Webpack fallback fix for client-side builds
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;


// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   // ✅ ESLint  Vercel
//   eslint: {
//     ignoreDuringBuilds: true,
//   },

//   // ✅ conf CSP 
//   async headers() {
//     return [
//       {
//         source: '/favicon.svg',
//         headers: [
//           {
//             key: 'Cache-Control',
//             value: 'public, max-age=31536000, immutable',
//           },
//         ],
//       },
//       {
//         source: '/:path*',
//         headers: [
//           {
//             key: 'Content-Security-Policy',
//             value: [
//               "default-src 'self'",
//               "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.lemonsqueezy.com https://assets.lemonsqueezy.com 'wasm-unsafe-eval'",
//               "style-src 'self' 'unsafe-inline'",
//               "img-src 'self' data: https:",
//               "frame-src https://checkout.lemonsqueezy.com",
//               "connect-src 'self' https://app.lemonsqueezy.com https://checkout.lemonsqueezy.com https://dzxvhnmtomanwiqsnanw.supabase.co https://assets.lemonsqueezy.com"
//             ].join('; ')
//           }
//         ]
//       }
//     ]
//   },

//   // ✅  fallback  fs  
//   webpack: (config, { dev, isServer }) => {
//     if (!isServer && !dev) {
//       config.resolve.fallback = {
//         ...config.resolve.fallback,
//         fs: false,
//       }
//     }
//     return config
//   },
// }

// export default nextConfig