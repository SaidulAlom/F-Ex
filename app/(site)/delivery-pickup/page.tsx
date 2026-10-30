import { Bike, Clock3, MapPin, PackageCheck } from 'lucide-react';
import Link from 'next/link';
import { PageHero } from '@/components/content/PageHero';
import { CTASection } from '@/components/content/CTASection';
import { FAQ } from '@/components/content/FAQ';
import { FeatureCards } from '@/components/content/FeatureCards';
import { StepGrid } from '@/components/content/StepGrid';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { buttonStyles } from '@/components/ui/button-styles';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 300;
export const metadata = buildMetadata({
  title: 'Delivery & Pickup in Guwahati',
  description: 'Free delivery, same-day local delivery and in-store pickup from F-Ex Store Lokhra and Basistha, Guwahati. Reserve online and confirm availability first.',
  path: '/delivery-pickup',
});

const features = [
  { title: 'In-store pickup', description: 'Reserve online and collect from Lokhra or Basistha after confirmation. Both branches stay open till 10 PM.', icon: PackageCheck },
  { title: 'Same-day delivery', description: 'Ask about same-day local delivery on available products. Timing depends on distance, stock and order time.', icon: Bike },
  { title: 'Free delivery', description: 'Free delivery is available on eligible orders. Our team confirms eligibility and timing before dispatch.', icon: MapPin },
];

const steps = [
  { title: 'Confirm stock', description: 'Call, WhatsApp or reserve the product so we can confirm the exact device and branch.' },
  { title: 'Choose collection', description: 'Pick up in person or ask about local delivery options for your address.' },
  { title: 'Complete payment', description: 'Use cash, UPI, card or EMI as available. Final billing is explained before handover.' },
  { title: 'Receive & check', description: 'Check the device, bill and warranty details at pickup or delivery.' },
];

const deliveryFaq = [
  { q: 'Is delivery always free?', a: 'Free delivery is available on eligible orders. Eligibility can depend on location, product and current offer — confirm with the team.' },
  { q: 'How late can I pick up?', a: 'Lokhra is open daily 10:30 AM–10 PM and Basistha 10 AM–10 PM IST. We recommend arriving a little before closing.' },
  { q: 'Can I reserve first?', a: 'Yes. Use the reservation form on any product page to request a branch and pickup time.' },
  { q: 'Do you deliver outside Guwahati?', a: 'Speak to the team about your location. Current delivery options focus on Guwahati and nearby areas.' },
];

export default function DeliveryPickupPage() {
  return (
    <>
      <PageHero
        eyebrow="Pickup & local delivery"
        title="Get your phone your way."
        description="Collect from either Guwahati branch, request same-day local delivery, or ask about free delivery eligibility."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Delivery & Pickup', href: '/delivery-pickup' }]}
      >
        <Link href="/shop" className={buttonStyles({ variant: 'orange' })}>Browse live stock</Link>
      </PageHero>

      <section className="bg-cloud py-14 sm:py-18">
        <Container>
          <Reveal><SectionHeading eyebrow="Your options" title="Pickup, same-day delivery and free delivery." description="We confirm availability and timing before you pay, so there are no surprises." /></Reveal>
          <div className="mt-9"><FeatureCards items={features} /></div>
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-18">
        <Container>
          <Reveal><SectionHeading eyebrow="Simple process" title="From live stock to your hands." align="center" /></Reveal>
          <div className="mt-9"><StepGrid items={steps} /></div>
          <Reveal delay={0.1}>
            <div className="mt-9 flex flex-col items-center justify-between gap-5 rounded-2xl border border-line bg-cloud p-6 text-center sm:flex-row sm:text-left">
              <div className="flex items-center gap-3">
                <Clock3 className="h-8 w-8 text-electric" aria-hidden="true" />
                <div>
                  <h2 className="text-lg font-bold text-navy">Open daily until 10 PM</h2>
                  <p className="text-sm text-ink">Late pickup is easy after work — check live branch status in IST on every branch page.</p>
                </div>
              </div>
              <Link href="/branches" className={buttonStyles({ variant: 'outline' })}>View branch hours</Link>
            </div>
          </Reveal>
        </Container>
      </section>

      <FAQ items={deliveryFaq} title="Delivery & pickup questions" />
      <CTASection title="Want it today?" description="Message us with the model and your preferred branch. We’ll confirm live stock and the fastest available collection option." />
    </>
  );
}
