import { type NextRequest, NextResponse } from 'next/server';
import { getProductFacets, getProducts } from '@/lib/data/catalog';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { searchSchema } from '@/lib/validators';
import { zodDetails } from '@/lib/api-response';
import { priceLabel } from '@/lib/utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Suggestion {
  label: string;
  sublabel: string;
  href: string;
  type: 'product' | 'brand' | 'all';
}

export async function GET(request: NextRequest) {
  const limiter = rateLimit(`search:${clientIp(request)}`, 40, 60_000);
  if (!limiter.success) {
    return NextResponse.json(
      { ok: false, message: 'Too many searches. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(limiter.retryAfter) } },
    );
  }

  const parsed = searchSchema.safeParse({
    q: request.nextUrl.searchParams.get('q') || '',
  });
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, details: zodDetails(parsed.error) },
      { status: 400 },
    );
  }

  const query = parsed.data.q;
  const [result, facets] = await Promise.all([
    getProducts({ q: query, limit: 6, page: 1, sort: 'featured' }),
    getProductFacets(),
  ]);

  const productSuggestions: Suggestion[] = result.items.map((product) => ({
    label: product.title,
    sublabel: `${product.brand} · ${priceLabel(product)} · ${product.status}`,
    href: `/product/${product.slug}`,
    type: 'product',
  }));

  const matchedBrand = facets.brands.find((brand) =>
    brand.toLowerCase().includes(query.toLowerCase()),
  );
  const brandSuggestion: Suggestion[] = matchedBrand
    ? [
        {
          label: `Browse all ${matchedBrand}`,
          sublabel: 'Brand filter in live stock',
          href: `/shop?brand=${encodeURIComponent(matchedBrand)}`,
          type: 'brand',
        },
      ]
    : [];

  return NextResponse.json({
    ok: true,
    query,
    suggestions: [...brandSuggestion, ...productSuggestions].slice(0, 7),
  });
}
