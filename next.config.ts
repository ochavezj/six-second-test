import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['randomuser.me'],
  },
  // Add rewrites for API routes
  async rewrites() {
    return [
      {
        source: '/api/checkout',
        destination: '/api/checkout',
      },
      {
        source: '/api/upload',
        destination: '/api/upload',
      },
    ];
  },
  // Ensure output is set to export for Vercel
  output: 'standalone',
  // Disable strict mode for production
  reactStrictMode: false,
  // Ensure trailing slashes are handled correctly
  trailingSlash: false,
};

export default nextConfig;
