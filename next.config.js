// next.config.js
const nextConfig = {
    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: [
                "default-src 'self'",
                "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.lemonsqueezy.com",
                "style-src 'self' 'unsafe-inline'",
                "img-src 'self' data: https:",
                "frame-src https://checkout.lemonsqueezy.com",
                "connect-src 'self' https://app.lemonsqueezy.com https://checkout.lemonsqueezy.com"
              ].join('; ')
            }
          ]
        }
      ]
    }
  }
  
  module.exports = nextConfig