import { Clock3, MapPin, Store } from 'lucide-react';
import { CountUp } from '@/components/motion/CountUp';
import { PaymentBadges } from '@/components/ui/PaymentBadges';

export function TrustStrip() {
  return (
    <section className="relative z-20 border-b border-line bg-white" aria-label="F-Ex Store trust highlights">
      <div className="container-content grid gap-6 py-7 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="grid grid-cols-3 divide-x divide-line">
          <div className="px-2 text-center sm:px-5">
            <Store className="mx-auto h-4 w-4 text-electric" aria-hidden="true" />
            <div className="mt-1 text-2xl font-extrabold text-navy sm:text-3xl">
              <CountUp end={2024} />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-ink sm:text-xs">Established</p>
          </div>
          <div className="px-2 text-center sm:px-5">
            <MapPin className="mx-auto h-4 w-4 text-electric" aria-hidden="true" />
            <div className="mt-1 text-2xl font-extrabold text-navy sm:text-3xl">
              <CountUp end={2} />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-ink sm:text-xs">Branches</p>
          </div>
          <div className="px-2 text-center sm:px-5">
            <Clock3 className="mx-auto h-4 w-4 text-electric" aria-hidden="true" />
            <div className="mt-1 text-2xl font-extrabold text-navy sm:text-3xl">
              <CountUp end={10} suffix=" PM" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-ink sm:text-xs">Open daily till</p>
          </div>
        </div>
        <div className="lg:text-right">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-ink">Easy payments</p>
          <PaymentBadges size="sm" className="justify-center lg:justify-end" />
        </div>
      </div>
    </section>
  );
}
