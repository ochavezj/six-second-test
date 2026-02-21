import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['randomuser.me'],
  },
  // Add rewrites for API routes
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/upload',
          destination: '/api/upload',
          has: [
            {
              type: 'header',
              key: 'content-type',
              value: '(.*)'
            }
          ],
          missing: [
            {
              type: 'header',
              key: 'x-middleware-preflight',
              value: '1'
            }
          ]
        },
        {
          source: '/api/checkout',
          destination: '/api/checkout',
          has: [
            {
              type: 'header',
              key: 'content-type',
              value: '(.*)'
            }
          ]
        }
      ]
    };
  },
  // Ensure output is set to export for Vercel
  output: 'standalone',
  // Disable strict mode for production
  reactStrictMode: false,
  // Ensure trailing slashes are handled correctly
  trailingSlash: false,
};

export default nextConfig;
