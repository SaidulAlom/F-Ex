import Link from 'next/link';
import { ArrowLeft, SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-5 py-20">
      <div className="max-w-xl rounded-3xl border border-line bg-white p-8 text-center shadow-soft md:p-12">
        <SearchX className="mx-auto h-12 w-12 text-orange" aria-hidden="true" />
        <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-electric">404</p>
        <h1 className="mt-2 text-4xl font-extrabold text-navy">That page isn’t in stock.</h1>
        <p className="mt-4 text-sm leading-6 text-ink">
          The link may have moved, or the product may no longer be listed. Browse live stock instead.
        </p>
        <Link
          href="/shop"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-bold text-white hover:bg-electric"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Browse all products
        </Link>
      </div>
    </main>
  );
}
