import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SmartImage } from '@/components/ui/SmartImage';
import { Badge } from '@/components/ui/Badge';
import { buttonStyles } from '@/components/ui/button-styles';
import type { Banner } from '@/lib/types';

const themes: Record<Banner['theme'], string> = {
  navy: 'bg-navy text-white',
  blue: 'bg-electric text-white',
  orange: 'bg-orange text-white',
};

export function OfferGrid({ banners }: { banners: Banner[] }) {
  if (!banners.length) return null;
  return (
    <section className="bg-cloud pb-14 sm:pb-18" aria-labelledby="offers-heading">
      <div className="container-content">
        <Reveal>
          <div id="offers-heading">
            <SectionHeading eyebrow="Offers from the database" title="This week at F-Ex Store" />
          </div>
        </Reveal>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {banners.map((banner, index) => (
            <Reveal key={banner.id} delay={index * 0.07}>
              <article className={`flex h-full flex-col overflow-hidden rounded-2xl shadow-soft ${themes[banner.theme]}`}>
                <div className="relative aspect-[16/9] overflow-hidden bg-white/10">
                  <SmartImage
                    src={banner.image}
                    alt={banner.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 380px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  {banner.badge ? <Badge tone="white" className="mb-3 w-fit">{banner.badge}</Badge> : null}
                  <h3 className="text-xl font-bold">{banner.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-white/85">{banner.subtitle}</p>
                  <Link href={banner.ctaHref} className={buttonStyles({ variant: 'white', size: 'sm', className: 'mt-5 w-fit' })}>
                    {banner.ctaLabel} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
