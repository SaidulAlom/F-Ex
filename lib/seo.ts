import type { Metadata } from 'next';
import { absoluteUrl, truncate } from '@/lib/utils';
import { siteConfig } from '@/lib/config';

export function buildMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const cleanDescription = truncate(description, 160);
  const ogImage = image ? absoluteUrl(image) : absoluteUrl(siteConfig.ogImage);
  const url = absoluteUrl(path);
  return {
    title,
    description: cleanDescription,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      title,
      description: cleanDescription,
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${siteConfig.name} — ${title}` }],
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: cleanDescription,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export function jsonLd<T>(data: T): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
