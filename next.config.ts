// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ تعطيل ESLint أثناء البناء على Vercel
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ إعدادات CSP محسّنة
  async headers() {
    return [
      {
        source: '/favicon.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
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
              "connect-src 'self' https://app.lemonsqueezy.com https://checkout.lemonsqueezy.com https://dzxvhnmtomanwiqsnanw.supabase.co https://assets.lemonsqueezy.com"
            ].join('; ')
          }
        ]
      }
    ]
  },

  // ✅ تعطيل fallback لمكتبة fs في المتصفح
  webpack: (config, { dev, isServer }) => {
    if (!isServer && !dev) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    return config
  },
}

export default nextConfig