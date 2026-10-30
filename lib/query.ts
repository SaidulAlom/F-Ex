import { z } from 'zod';
import { CATEGORY_OPTIONS } from '@/lib/constants';
import { first } from '@/lib/utils';
import type { ProductQuery } from '@/lib/types';

const categories = CATEGORY_OPTIONS.map((option) => option.value) as [
  (typeof CATEGORY_OPTIONS)[number]['value'],
  ...(typeof CATEGORY_OPTIONS)[number]['value'][],
];

export const productQuerySchema = z.object({
  q: z.string().trim().max(80).optional(),
  category: z.enum(categories).optional(),
  categories: z.array(z.enum(categories)).max(5).optional(),
  brand: z.string().trim().max(60).optional(),
  condition: z.enum(['New', 'Pre-owned', 'Refurbished', 'Accessory']).optional(),
  status: z.enum(['Available', 'Reserved', 'Sold']).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  branch: z.enum(['lokhra', 'basistha', 'both']).optional(),
  sort: z.enum(['featured', 'newest', 'price-asc', 'price-desc']).default('featured'),
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(9),
});

type SearchParams = Record<string, string | string[] | undefined>;

export function parseProductQuery(
  searchParams: SearchParams,
  overrides: Partial<ProductQuery> = {},
): ProductQuery {
  const raw: Record<string, string | string[] | undefined> = {
    q: first(searchParams.q),
    category: first(searchParams.category) || undefined,
    categories: first(searchParams.categories)
      ?.split(',')
      .filter((value): value is (typeof categories)[number] =>
        categories.includes(value as (typeof categories)[number]),
      ),
    brand: first(searchParams.brand) || undefined,
    condition: first(searchParams.condition) || undefined,
    status: first(searchParams.status) || undefined,
    minPrice: first(searchParams.minPrice) || undefined,
    maxPrice: first(searchParams.maxPrice) || undefined,
    branch: first(searchParams.branch) || undefined,
    sort: first(searchParams.sort) || undefined,
    page: first(searchParams.page) || undefined,
    limit: first(searchParams.limit) || undefined,
  };
  const parsed = productQuerySchema.safeParse({ ...raw, ...overrides });
  const query = parsed.success ? parsed.data : productQuerySchema.parse({});
  return { ...query, ...overrides };
}

export function productQueryToSearchParams(query: ProductQuery): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, Array.isArray(value) ? value.join(',') : String(value));
    }
  }
  return params;
}
