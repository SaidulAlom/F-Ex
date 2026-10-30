'use client';

import { BRANDS, PAYMENT_METHODS } from '@/lib/constants';

function BrandGroup({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-3 px-3" aria-hidden={hidden || undefined}>
      {BRANDS.map((brand) => (
        <span
          key={brand}
          className="rounded-xl border border-line bg-white px-5 py-2.5 text-sm font-extrabold tracking-tight text-navy shadow-sm"
        >
          {brand}
        </span>
      ))}
      {PAYMENT_METHODS.map((method) => (
        <span
          key={method.name}
          className="rounded-xl border border-line bg-white px-4 py-2.5 text-xs font-bold text-slate-500"
        >
          {method.short}
        </span>
      ))}
    </div>
  );
}

export function BrandMarquee() {
  return (
    <section className="border-y border-line bg-white/70 py-5" aria-label="Brands and payment methods">
      <div className="marquee-viewport">
        <div className="marquee-track">
          <BrandGroup />
          <BrandGroup hidden />
        </div>
      </div>
    </section>
  );
}
