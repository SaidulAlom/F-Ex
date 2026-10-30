'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

/**
 * Writes filter changes to the URL so every listing state is shareable and
 * server-renderable for SEO. Navigation uses the App Router.
 */
export function useUrlFilters(basePath?: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setFilter = useCallback(
    (key: string, value?: string | number | boolean | null, nextPath?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === undefined || value === null || value === '' || value === false) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
      const target = nextPath || basePath || pathname;
      const query = params.toString();
      router.push(query ? `${target}?${query}` : target, { scroll: false });
    },
    [basePath, pathname, router, searchParams],
  );

  const setFilters = useCallback(
    (
      values: Record<string, string | number | boolean | null | undefined>,
      options: { nextPath?: string; resetKeys?: string[] } = {},
    ) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const key of options.resetKeys || []) params.delete(key);
      for (const [key, value] of Object.entries(values)) {
        if (value === undefined || value === null || value === '' || value === false) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }
      const target = options.nextPath || basePath || pathname;
      const query = params.toString();
      router.push(query ? `${target}?${query}` : target, { scroll: false });
    },
    [basePath, pathname, router, searchParams],
  );

  return { searchParams, setFilter, setFilters };
}
