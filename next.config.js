/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Empty turbopack config to silence Next.js 16 warning
  turbopack: {},
  // Output standalone for better deployment
  output: 'standalone',
};

module.exports = nextConfig;
