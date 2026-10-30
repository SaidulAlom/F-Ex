/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  serverExternalPackages: ['mongoose', 'bcryptjs', 'cloudinary', 'resend'],
  trailingSlash: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const unsafeEval = isDevelopment ? " 'unsafe-eval'" : '';
    // Arena/Vercel live previews render the site in a cross-origin iframe. CSP
    // frame-ancestors is used instead of the legacy X-Frame-Options header.
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self' https://*.e2b.app https://*.vercel.app",
      "form-action 'self' https://api.cloudinary.com",
      `script-src 'self' 'unsafe-inline'${unsafeEval} https://www.googletagmanager.com https://www.google-analytics.com`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://res.cloudinary.com https://www.google-analytics.com https://www.googletagmanager.com",
      "font-src 'self' data:",
      "connect-src 'self' https://api.cloudinary.com https://www.google-analytics.com https://region1.google-analytics.com",
      "frame-src 'self' https://www.google.com https://maps.google.com https://www.google.com/maps https://www.youtube.com",
    ].join('; ');

    const headers = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(self), payment=(), usb=()',
      },
      { key: 'Content-Security-Policy', value: csp },
    ];

    if (!isDevelopment) {
      headers.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      });
    }

    return [{ source: '/:path*', headers }];
  },
};

export default nextConfig;
