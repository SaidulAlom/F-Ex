import { ArrowUpRight, Quote } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Rating } from '@/components/ui/Rating';
import { buttonStyles } from '@/components/ui/button-styles';
import { siteConfig } from '@/lib/config';
import { initials } from '@/lib/utils';
import type { Testimonial } from '@/lib/types';

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null;
  return (
    <section className="bg-white py-14 sm:py-18">
      <div className="container-content">
        <Reveal>
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Customer stories"
              title="Straight answers. Friendly service."
              description="Reviews are curated by the F-Ex Store team. You can also read our latest Google reviews."
            />
            <a
              href={siteConfig.social.googleReviews}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles({ variant: 'outline', className: 'w-fit' })}
            >
              Google reviews <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </Reveal>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 5).map((testimonial, index) => (
            <Reveal key={testimonial.id} delay={Math.min(index * 0.05, 0.2)}>
              <figure className="flex h-full flex-col rounded-2xl border border-line bg-cloud p-5 shadow-soft">
                <Quote className="h-6 w-6 text-orange" aria-hidden="true" />
                <Rating value={testimonial.rating} className="mt-4" />
                <blockquote className="mt-3 flex-1 text-sm leading-6 text-navy">“{testimonial.quote}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-electric/10 text-xs font-extrabold text-electric">
                    {initials(testimonial.name)}
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-navy">{testimonial.name}</span>
                    <span className="block text-xs text-ink">{testimonial.location}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
