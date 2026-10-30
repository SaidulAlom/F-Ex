import { ArrowRight, Clock3, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { PageHero } from '@/components/content/PageHero';
import { CTASection } from '@/components/content/CTASection';
import { StepGrid } from '@/components/content/StepGrid';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Reveal } from '@/components/motion/Reveal';
import { SellWaitlistForm } from '@/components/forms/SellWaitlistForm';
import { buttonStyles } from '@/components/ui/button-styles';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 300;
export const metadata = buildMetadata({
  title: 'Sell or Exchange Your Phone — Coming Soon',
  description: 'Online sell and exchange valuation is coming soon to F-Ex Store Guwahati. Join the Phase 2 waitlist and our team will notify you when it launches.',
  path: '/sell-exchange',
});

const steps = [
  { title: 'Register interest', description: 'Tell us the device you want to sell or exchange through the waitlist form.' },
  { title: 'Get a launch alert', description: 'We’ll contact you when online valuation opens in Phase 2.' },
  { title: 'Visit for inspection', description: 'Bring the phone, accessories and ID. Condition and market value are checked in person.' },
  { title: 'Choose upgrade or payout', description: 'Use the quoted value toward your next phone or discuss available settlement options.' },
];

export default function SellExchangePage() {
  return (
    <>
      <PageHero
        eyebrow="Phase 2 · coming soon"
        title="Sell or exchange your phone, soon online."
        description="We’re building a simple valuation flow. Until then, register your interest and talk to the team about your current device."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Sell / Exchange', href: '/sell-exchange' }]}
      >
        <Badge tone="white" className="text-xs">
          <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
          Online valuation not live yet
        </Badge>
      </PageHero>

      <section className="bg-cloud py-14 sm:py-18">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <Reveal>
              <div className="rounded-3xl border border-line bg-white p-7 shadow-card sm:p-10">
                <Badge tone="orange" className="mb-5">Coming soon</Badge>
                <h2 className="text-3xl font-extrabold text-navy sm:text-4xl">A faster way to value your old phone.</h2>
                <p className="mt-4 text-sm leading-7 text-ink">
                  Phase 2 will add an online sell/exchange journey with device details, condition checks and a team-reviewed quote. We’re keeping it deliberately simple and transparent.
                </p>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {[
                    ['Device details', 'Brand, model, storage and working condition.'],
                    ['Fair assessment', 'Physical inspection before a confirmed quote.'],
                    ['Upgrade path', 'Put eligible value toward your next device.'],
                    ['Human support', 'Ask questions at Lokhra or Basistha.'],
                  ].map(([title, description]) => (
                    <div key={title} className="rounded-2xl bg-cloud p-4">
                      <Sparkles className="h-5 w-5 text-orange" aria-hidden="true" />
                      <h3 className="mt-3 text-sm font-bold text-navy">{title}</h3>
                      <p className="mt-1 text-xs leading-5 text-ink">{description}</p>
                    </div>
                  ))}
                </div>
                <Link href="/shop" className={buttonStyles({ variant: 'outline', className: 'mt-7' })}>
                  Browse upgrade options <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <SellWaitlistForm />
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-18">
        <Container>
          <Reveal><SectionHeading eyebrow="How Phase 2 will work" title="Planned journey" description="The flow below is a preview; the online valuation tool is not live yet." align="center" /></Reveal>
          <div className="mt-9"><StepGrid items={steps} /></div>
        </Container>
      </section>

      <CTASection title="Have an exchange question today?" description="Our team can still explain current in-store exchange options and help you choose an upgrade." />
    </>
  );
}
