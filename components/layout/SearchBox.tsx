'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { GA_EVENTS, trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';

interface Suggestion {
  label: string;
  sublabel: string;
  href: string;
  type: 'product' | 'brand' | 'all';
}

export function SearchBox({
  className,
  onNavigate,
  autoFocus = false,
}: {
  className?: string;
  onNavigate?: () => void;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputId = useId();
  const listId = `${inputId}-suggestions`;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const debounced = useDebounce(query, 250); // Debounce timing: tweak here.

  useEffect(() => {
    const term = debounced.trim();
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      if (term.length < 2) {
        setResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as { suggestions?: Suggestion[] };
        if (!controller.signal.aborted) setResults(data.suggestions || []);
      } catch (error) {
        if (!controller.signal.aborted && (error as Error).name !== 'AbortError') setResults([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 0);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [debounced]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const submit = (value = query) => {
    const term = value.trim();
    if (!term) return;
    trackEvent(GA_EVENTS.search, { search_term: term });
    router.push(`/shop?q=${encodeURIComponent(term)}`);
    setOpen(false);
    onNavigate?.();
  };

  const select = (suggestion: Suggestion) => {
    trackEvent(GA_EVENTS.selectItem, { item_name: suggestion.label, source: 'site-search' });
    router.push(suggestion.href);
    setOpen(false);
    onNavigate?.();
  };

  return (
    <div ref={rootRef} className={cn('relative w-full', className)}>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        className="relative"
      >
        <label htmlFor={inputId} className="sr-only">
          Search phones by model or brand
        </label>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input
          id={inputId}
          type="search"
          value={query}
          autoFocus={autoFocus}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          placeholder="Search iPhone, Vivo, Samsung…"
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              setActive((current) => Math.min(current + 1, results.length - 1));
            } else if (event.key === 'ArrowUp') {
              event.preventDefault();
              setActive((current) => Math.max(current - 1, 0));
            } else if (event.key === 'Enter' && open && results[active]) {
              event.preventDefault();
              select(results[active]);
            } else if (event.key === 'Escape') {
              setOpen(false);
            }
          }}
          className="focus-ring w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-10 text-sm text-navy placeholder:text-slate-400"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-navy"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </form>

      {open && query.trim().length >= 2 ? (
        <div
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-card"
        >
          {loading ? (
            <div className="flex items-center gap-2 px-3 py-3 text-sm text-ink">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Searching live stock…
            </div>
          ) : results.length ? (
            results.map((suggestion, index) => (
              <button
                type="button"
                key={`${suggestion.href}-${suggestion.label}`}
                role="option"
                aria-selected={index === active}
                onMouseEnter={() => setActive(index)}
                onClick={() => select(suggestion)}
                className={cn(
                  'block w-full rounded-xl px-3 py-2.5 text-left',
                  index === active ? 'bg-electric/8' : 'hover:bg-cloud',
                )}
              >
                <span className="block text-sm font-bold text-navy">{suggestion.label}</span>
                <span className="block text-xs text-ink">{suggestion.sublabel}</span>
              </button>
            ))
          ) : (
            <div className="px-3 py-3 text-sm text-ink">
              No match yet.{' '}
              <Link href="/contact" className="font-bold text-electric" onClick={onNavigate}>
                Ask our team
              </Link>
              .
            </div>
          )}
          <button
            type="button"
            onClick={() => submit()}
            className="mt-1 w-full rounded-xl bg-cloud px-3 py-2.5 text-left text-xs font-bold text-electric hover:bg-electric/10"
          >
            See all results for “{query.trim()}”
          </button>
        </div>
      ) : null}
    </div>
  );
}
