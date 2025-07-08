import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Enable standalone output for better deployment performance
  output: 'standalone',
  // Ensure proper handling of static exports
  trailingSlash: false,
  reactStrictMode: true,
};

export default nextConfig;
