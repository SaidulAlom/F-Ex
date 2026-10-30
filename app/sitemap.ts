import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config';
import { getAllProductSlugs } from '@/lib/data/catalog';

const staticRoutes = [
  '',
  '/shop',
  '/new-phones',
  '/second-hand-phones',
  '/accessories',
  '/repair',
  '/emi-payments',
  '/delivery-pickup',
  '/sell-exchange',
  '/branches',
  '/branches/lokhra',
  '/branches/basistha',
  '/about',
  '/contact',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const productSlugs = await getAllProductSlugs().catch(() => []);
  return [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.url}${route || '/'}`,
      lastModified: now,
      changeFrequency: route === '' ? ('daily' as const) : ('weekly' as const),
      priority: route === '' ? 1 : route.startsWith('/product/') ? 0.7 : 0.8,
    })),
    ...productSlugs.map((slug) => ({
      url: `${siteConfig.url}/product/${slug}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    })),
  ];
}
