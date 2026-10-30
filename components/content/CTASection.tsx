import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { CallLink, WhatsAppLink } from '@/components/analytics/ContactLinks';
import { buttonStyles } from '@/components/ui/button-styles';
import { getPrimaryBranch, siteConfig } from '@/lib/config';

export function CTASection({
  title = 'Ready to find your next phone?',
  description = 'Visit Lokhra or Basistha, message us on WhatsApp, or call before you travel to confirm live stock.',
}: {
  title?: string;
  description?: string;
}) {
  const primary = getPrimaryBranch();
  return (
    <section className="bg-white py-14 sm:py-18">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-navy px-6 py-10 text-white shadow-card sm:px-10 sm:py-12">
          <div className="hero-orb hero-orb-b -right-20 -top-24 h-72 w-72 bg-orange/30" />
          <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange">F-Ex Store · Guwahati</p>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-blue-100 sm:text-base">{description}</p>
              <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-100">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Open daily until 10 PM · {siteConfig.established} · Two branches
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <CallLink branch={primary} location="section-cta" label="Call now" className={buttonStyles({ variant: 'orange' })} />
              <WhatsAppLink branchSlug="lokhra" location="section-cta" label="WhatsApp us" className={buttonStyles({ variant: 'white' })} />
              <Link href="/branches" className={buttonStyles({ variant: 'outline', className: 'border-white/20 bg-white/5 text-white hover:text-white' })}>
                Get directions <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
