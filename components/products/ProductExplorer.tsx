'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FilterX, Search, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { buttonStyles } from '@/components/ui/button-styles';
import { useUrlFilters } from '@/hooks/use-url-filters';
import {
  CATEGORY_OPTIONS,
  CONDITION_OPTIONS,
  PRICE_RANGES,
  STATUS_OPTIONS,
} from '@/lib/constants';
import type { ProductCategory, ProductQuery, ProductResult } from '@/lib/types';
import { cn } from '@/lib/utils';

const selectClass =
  'focus-ring w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm font-semibold text-navy';

function priceValue(query: ProductQuery): string {
  if (query.minPrice === undefined && query.maxPrice === undefined) return '';
  return `${query.minPrice ?? ''}-${query.maxPrice ?? ''}`;
}

function ExplorerInner({
  result,
  facets,
  query,
  basePath,
  lockedCategory,
  lockedCategories,
}: {
  result: ProductResult;
  facets: { brands: string[] };
  query: ProductQuery;
  basePath: string;
  lockedCategory?: ProductCategory;
  lockedCategories?: ProductCategory[];
}) {
  const reduced = useReducedMotion();
  const router = useRouter();
  const pathname = usePathname();
  const { searchParams, setFilters } = useUrlFilters();
  const searchRef = useRef<HTMLInputElement>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Ensure dedicated category pages expose the locked category/categories in
  // the URL too, so every filter state is shareable and server-renderable.
  useEffect(() => {
    if (lockedCategory && searchParams.get('category') !== lockedCategory) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('category', lockedCategory);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      return;
    }
    const lockedValue = lockedCategories?.join(',');
    if (
      lockedValue &&
      !searchParams.get('category') &&
      searchParams.get('categories') !== lockedValue
    ) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('categories', lockedValue);
      params.delete('category');
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [lockedCategories, lockedCategory, pathname, router, searchParams]);

  const activeFilterCount = useMemo(() => {
    return [
      query.brand,
      query.condition,
      query.status,
      query.minPrice !== undefined || query.maxPrice !== undefined,
      query.q,
    ].filter(Boolean).length;
  }, [query]);

  const updateFilter = (key: string, value?: string | number | boolean | null) => {
    setFilters({ [key]: value, page: null }, { resetKeys: ['page'] });
  };

  const setPrice = (value: string) => {
    if (!value) {
      setFilters({ minPrice: null, maxPrice: null, page: null }, { resetKeys: ['minPrice', 'maxPrice', 'page'] });
      return;
    }
    const [min, max] = value.split('-');
    setFilters(
      {
        minPrice: min || null,
        maxPrice: max || null,
        page: null,
      },
      { resetKeys: ['minPrice', 'maxPrice', 'page'] },
    );
  };

  const setCategory = (value: string) => {
    const isMulti = value.includes(',');
    if (isMulti) {
      setFilters(
        { categories: value, category: null, page: null },
        { nextPath: pathname, resetKeys: ['categories', 'category', 'page'] },
      );
      return;
    }
    const route =
      pathname.startsWith('/accessories')
        ? pathname
        : CATEGORY_OPTIONS.find((option) => option.value === value)?.href || '/shop';
    setFilters(
      { category: value, categories: null, page: null },
      { nextPath: route, resetKeys: ['categories', 'category', 'page'] },
    );
  };

  const clearAll = () => router.push(basePath, { scroll: false });

  return (
    <div>
      <div className="rounded-2xl border border-line bg-white p-3 shadow-soft sm:p-4">
        <div className="flex gap-2">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              updateFilter('q', searchRef.current?.value.trim() || null);
            }}
            className="relative flex-1"
          >
            <label htmlFor="catalog-search" className="sr-only">Search stock</label>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              id="catalog-search"
              key={query.q || 'empty-search'}
              ref={searchRef}
              defaultValue={query.q || ''}
              placeholder="Search model or brand…"
              className="focus-ring w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-3 text-sm text-navy"
            />
          </form>
          <button
            type="button"
            onClick={() => setFiltersOpen((value) => !value)}
            aria-expanded={filtersOpen}
            className={buttonStyles({ variant: 'outline', size: 'md', className: 'sm:hidden' })}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filters
            {activeFilterCount ? (
              <span className="rounded-full bg-electric px-1.5 py-0.5 text-[10px] text-white">{activeFilterCount}</span>
            ) : null}
          </button>
        </div>

        <div className={cn('mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-6', !filtersOpen && 'hidden sm:grid')}>
          <label className="block">
            <span className="sr-only">Category</span>
            <select
              value={
                query.category ||
                lockedCategory ||
                query.categories?.join(',') ||
                lockedCategories?.join(',') ||
                ''
              }
              onChange={(event) => setCategory(event.target.value)}
              className={selectClass}
              aria-label="Filter by category"
            >
              <option value="">All categories</option>
              <option value="accessory,gadget,landline">Accessories & gadgets</option>
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Brand</span>
            <select
              value={query.brand || ''}
              onChange={(event) => updateFilter('brand', event.target.value || null)}
              className={selectClass}
              aria-label="Filter by brand"
            >
              <option value="">All brands</option>
              {facets.brands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Price range</span>
            <select
              value={priceValue(query)}
              onChange={(event) => setPrice(event.target.value)}
              className={selectClass}
              aria-label="Filter by price range"
            >
              {PRICE_RANGES.map((range) => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Condition</span>
            <select
              value={query.condition || ''}
              onChange={(event) => updateFilter('condition', event.target.value || null)}
              className={selectClass}
              aria-label="Filter by condition"
            >
              <option value="">Any condition</option>
              {CONDITION_OPTIONS.map((condition) => (
                <option key={condition} value={condition}>{condition}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Availability</span>
            <select
              value={query.status || ''}
              onChange={(event) => updateFilter('status', event.target.value || null)}
              className={selectClass}
              aria-label="Filter by availability"
            >
              <option value="">All availability</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Sort</span>
            <select
              value={query.sort || 'featured'}
              onChange={(event) => updateFilter('sort', event.target.value)}
              className={selectClass}
              aria-label="Sort products"
            >
              <option value="featured">Featured first</option>
              <option value="newest">Newest first</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mb-4 mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-ink">
        <p aria-live="polite">
          Showing <strong className="text-navy">{result.total ? (result.page - 1) * result.limit + 1 : 0}–{Math.min(result.page * result.limit, result.total)}</strong> of{' '}
          <strong className="text-navy">{result.total}</strong> products
        </p>
        {activeFilterCount || searchParams.get('sort') ? (
          <button type="button" onClick={clearAll} className="inline-flex items-center gap-1.5 font-bold text-electric hover:underline">
            <FilterX className="h-4 w-4" aria-hidden="true" />
            Clear filters
          </button>
        ) : null}
      </div>

      {result.items.length === 0 ? (
        <EmptyState
          title="No products match those filters"
          description="Try a wider price range, another brand, or ask our team — new stock arrives regularly."
          action={
            <button type="button" onClick={clearAll} className={buttonStyles({ variant: 'primary' })}>
              Reset filters
            </button>
          }
        />
      ) : (
        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {result.items.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.28, delay: reduced ? 0 : Math.min(index * 0.035, 0.2) }}
              >
                <ProductCard product={product} priority={index < 3} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {result.pages > 1 ? (
        <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Product pagination">
          <button
            type="button"
            disabled={result.page <= 1}
            onClick={() => setFilters({ page: result.page - 1 })}
            className="focus-ring rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-bold text-navy disabled:opacity-40"
          >
            Previous
          </button>
          {Array.from({ length: result.pages }).map((_, index) => {
            const page = index + 1;
            if (result.pages > 7 && Math.abs(page - result.page) > 2 && page !== 1 && page !== result.pages) return null;
            return (
              <button
                key={page}
                type="button"
                onClick={() => setFilters({ page })}
                aria-current={page === result.page ? 'page' : undefined}
                className={cn(
                  'focus-ring h-10 w-10 rounded-xl text-sm font-bold',
                  page === result.page ? 'bg-electric text-white' : 'border border-line bg-white text-navy',
                )}
              >
                {page}
              </button>
            );
          })}
          <button
            type="button"
            disabled={result.page >= result.pages}
            onClick={() => setFilters({ page: result.page + 1 })}
            className="focus-ring rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-bold text-navy disabled:opacity-40"
          >
            Next
          </button>
        </nav>
      ) : null}
    </div>
  );
}

export function ProductExplorer(props: {
  result: ProductResult;
  facets: { brands: string[] };
  query: ProductQuery;
  basePath: string;
  lockedCategory?: ProductCategory;
  lockedCategories?: ProductCategory[];
}) {
  return (
    <Suspense fallback={<div className="min-h-96 animate-pulse rounded-2xl bg-white" />}>
      <ExplorerInner {...props} />
    </Suspense>
  );
}
