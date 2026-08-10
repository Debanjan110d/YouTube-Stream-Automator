import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN' // Protects against clickjacking attacks
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff' // Prevents MIME sniffing
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  }
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1', 'localhost', '192.168.0.105', '192.168.0.105:3000'],
  async headers() {
    return [
      {
        // Apply these headers to all routes in the application
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
export { nextConfig };
