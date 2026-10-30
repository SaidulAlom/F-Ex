import { BadgeCheck, Clock3, HeartHandshake, MapPinned } from 'lucide-react';
import { PageHero } from '@/components/content/PageHero';
import { CTASection } from '@/components/content/CTASection';
import { FeatureCards } from '@/components/content/FeatureCards';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { BranchCards } from '@/components/branches/BranchCards';
import { getBranches } from '@/lib/data/content';
import { siteConfig } from '@/lib/config';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 300;
export const metadata = buildMetadata({
  title: 'About F-Ex Store Guwahati',
  description: 'Established in 2024, F-Ex Store is a Guwahati mobile phone dealership with Lokhra and Basistha branches, late opening hours and a service-first approach.',
  path: '/about',
});

const values = [
  { title: 'Clear information', description: 'Condition grades, battery health, warranty and stock status are shown before you decide.', icon: BadgeCheck },
  { title: 'Late, daily hours', description: 'Open until 10 PM every day so customers can visit after work or college.', icon: Clock3 },
  { title: 'Local convenience', description: 'Two Guwahati branches, pickup, same-day delivery and free delivery on eligible orders.', icon: MapPinned },
  { title: 'Practical help', description: 'We explain device options and repair estimates in straightforward language.', icon: HeartHandshake },
];

export default async function AboutPage() {
  const branches = await getBranches();
  return (
    <>
      <PageHero
        eyebrow={`Est. ${siteConfig.established} · Guwahati`}
        title="A neighbourhood phone store with modern, transparent service."
        description="F-Ex Store helps Guwahati choose, maintain and upgrade mobile devices — without guesswork about condition, price or availability."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About Us', href: '/about' }]}
      />

      <section className="bg-cloud py-14 sm:py-18">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <SectionHeading eyebrow="Our story" title="Built in 2024 around what customers actually ask." description="Which phone is right for me? Is this used device healthy? Can I pay monthly? Can someone look at my screen today?" />
              <div className="mt-6 space-y-4 text-sm leading-7 text-ink">
                <p>F-Ex Store started with a simple idea: a mobile shop should make the important details easy to see. New and second-hand phones sit side by side with clear condition information, while our repair desk handles common hardware problems.</p>
                <p>With branches in Lokhra and Basistha, daily 10 PM closing, WhatsApp support and flexible payment methods, we make it easier to shop around your schedule.</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ['2024', 'Established'],
                  ['2', 'Guwahati branches'],
                  ['10 PM', 'Daily closing'],
                  ['7 days', 'Open every day'],
                ].map(([value, label], index) => (
                  <div key={label} className={`rounded-2xl p-6 ${index === 0 ? 'bg-navy text-white' : index === 3 ? 'bg-electric text-white' : 'border border-line bg-white'}`}>
                    <p className={`text-4xl font-extrabold ${index === 0 || index === 3 ? 'text-orange' : 'text-electric'}`}>{value}</p>
                    <p className={`mt-2 text-sm font-bold ${index === 0 || index === 3 ? 'text-white' : 'text-navy'}`}>{label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-18">
        <Container>
          <Reveal><SectionHeading eyebrow="What we value" title="Straight answers, useful stock, real support." align="center" /></Reveal>
          <div className="mt-9"><FeatureCards items={values} /></div>
        </Container>
      </section>

      <section className="bg-cloud py-14 sm:py-18">
        <Container>
          <Reveal><SectionHeading eyebrow="Visit us" title="Two branches. One friendly team." description="Find live open/closed status, directions and click-to-call details below." /></Reveal>
          <div className="mt-9"><BranchCards branches={branches} showMap={false} /></div>
        </Container>
      </section>

      <CTASection title="Come see the difference." description="Compare phones in person, ask about condition grades, or get a repair assessment from the team." />
    </>
  );
}
