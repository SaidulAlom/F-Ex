'use client';

import Link from 'next/link';

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cloud px-5">
      <div className="w-full max-w-lg rounded-3xl border border-line bg-white p-8 text-center shadow-soft">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange">Something went wrong</p>
        <h1 className="mt-3 text-3xl font-extrabold text-navy">We hit a small snag.</h1>
        <p className="mt-3 text-sm leading-6 text-ink">
          Please try again. If the issue continues, call us or reach out on WhatsApp.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="focus-ring rounded-xl bg-electric px-5 py-3 text-sm font-bold text-white"
          >
            Try again
          </button>
          <Link
            href="/"
            className="focus-ring rounded-xl border border-line px-5 py-3 text-sm font-bold text-navy"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
