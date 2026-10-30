import type { Metadata, Viewport } from 'next';
import { Inter, Sora } from 'next/font/google';
import { siteConfig } from '@/lib/config';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { MotionProvider } from '@/components/motion/MotionProvider';
import './globals.css';

const display = Sora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sora',
  adjustFontFallback: true,
});

const body = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Mobile Phones, Repairs & Accessories in Guwahati`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    'mobile shop Lokhra',
    'mobile shop Basistha',
    'mobile phone showroom Guwahati',
    'second hand phones Guwahati',
    'iPhone shop Guwahati',
    'phone repair Guwahati',
    'F-Ex Store',
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Mobile Phones & Repairs in Guwahati`,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — Mobile Phones & Repairs in Guwahati`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: '/images/fex-logo.svg',
    shortcut: '/images/fex-logo.svg',
    apple: '/images/fex-logo.svg',
  },
  robots: { index: true, follow: true },
  category: 'shopping',
};

export const viewport: Viewport = {
  themeColor: '#0B1220',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${body.variable}`}>
      <body>
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-navy focus:shadow-soft"
        >
          Skip to content
        </a>
        <GoogleAnalytics />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
