import { revalidatePath, revalidateTag } from 'next/cache';
import { CATEGORY_OPTIONS } from '@/lib/constants';
import type { Product } from '@/lib/types';

export const CACHE_TAGS = {
  products: 'products',
  banners: 'banners',
  branches: 'branches',
  testimonials: 'testimonials',
  leads: 'leads',
} as const;

type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

/** Called by every admin mutation for immediate on-demand ISR. */
export function revalidatePublicContent(tags: CacheTag[], paths: string[] = []): void {
  // expire: 0 purges immediately; on Vercel this propagates across regions.
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  revalidatePath('/', 'layout');
  for (const path of paths) revalidatePath(path);
}

export const PUBLIC_LISTING_PATHS = [
  '/',
  '/shop',
  '/new-phones',
  '/second-hand-phones',
  '/accessories',
  '/branches',
];

export function productPaths(product: Pick<Product, 'slug' | 'category'>): string[] {
  const categoryPath = CATEGORY_OPTIONS.find((option) => option.value === product.category)?.href;
  return [
    ...PUBLIC_LISTING_PATHS,
    ...(categoryPath ? [categoryPath] : []),
    `/product/${product.slug}`,
  ];
}

export function branchPaths(slug: string): string[] {
  return ['/branches', `/branches/${slug}`, '/contact'];
}
