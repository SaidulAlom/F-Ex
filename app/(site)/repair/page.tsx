import { BatteryCharging, Camera, Cpu, Fingerprint, Smartphone, Wrench } from 'lucide-react';
import { PageHero } from '@/components/content/PageHero';
import { CTASection } from '@/components/content/CTASection';
import { FAQ } from '@/components/content/FAQ';
import { FeatureCards } from '@/components/content/FeatureCards';
import { StepGrid } from '@/components/content/StepGrid';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { RepairForm } from '@/components/forms/RepairForm';
import { WhatsAppLink } from '@/components/analytics/ContactLinks';
import { buttonStyles } from '@/components/ui/button-styles';
import { buildMetadata } from '@/lib/seo';
import { REPAIR_SERVICES, REPAIR_STEPS } from '@/lib/constants';

export const revalidate = 300;
export const metadata = buildMetadata({
  title: 'Mobile Phone Repair Services in Guwahati',
  description: 'Screen, motherboard, speaker, camera, fingerprint sensor and battery repairs in Lokhra and Basistha, Guwahati. Request a diagnosis from F-Ex Store.',
  path: '/repair',
});

const iconMap = {
  screen: Smartphone,
  chip: Cpu,
  camera: Camera,
  fingerprint: Fingerprint,
  battery: BatteryCharging,
};

const repairFaq = [
  {
    q: 'Do you charge for diagnosis?',
    a: 'Ask the branch for the current diagnostic policy when you submit your request. We explain the estimate before repair work begins.',
  },
  {
    q: 'Can you repair all brands?',
    a: 'We work on common Apple, Vivo, Samsung, Redmi, OnePlus and other Android models. Part availability varies by model.',
  },
  {
    q: 'How long does a repair take?',
    a: 'Many straightforward repairs can be assessed the same day. Timing depends on the issue and part availability; we’ll confirm before pickup.',
  },
  {
    q: 'Can I send a photo first?',
    a: 'Yes. Add a photo to the repair request form. It helps our technician prepare, but a physical diagnosis is still required.',
  },
];

export default function RepairPage() {
  const features = REPAIR_SERVICES.map((service) => ({
    title: service.title,
    description: service.description,
    icon: iconMap[service.icon as keyof typeof iconMap] || Wrench,
    accent: 'bg-orange/10 text-orange',
  }));

  return (
    <>
      <PageHero
        eyebrow="Repair desk · open till 10 PM"
        title="Phone repairs with a clear first diagnosis."
        description="Cracked screen, battery drain, charging fault, camera issue or fingerprint sensor trouble? Tell us what happened and our team will guide you through the next step."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Repair Services', href: '/repair' }]}
      >
        <WhatsAppLink
          branchSlug="lokhra"
          location="repair-hero"
          message="Hello F-Ex Store, I need help with a phone repair."
          label="WhatsApp a technician"
          className={buttonStyles({ variant: 'orange' })}
        />
      </PageHero>

      <section className="bg-cloud py-14 sm:py-18">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="What we fix" title="Hardware repair, handled step by step." description="From display replacement to chip-level faults, we start by identifying the actual problem." />
          </Reveal>
          <div className="mt-9">
            <FeatureCards items={features} />
          </div>
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-18">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="How it works" title="Submit · Diagnose · Repair · Pickup" description="A simple process with approval before work starts." align="center" />
          </Reveal>
          <div className="mt-9">
            <StepGrid items={REPAIR_STEPS} />
          </div>
        </Container>
      </section>

      <section className="bg-cloud py-14 sm:py-18" id="repair-request">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <Reveal>
              <div className="lg:sticky lg:top-24">
                <SectionHeading eyebrow="Start here" title="Tell us what’s wrong." description="Share the model, issue and an optional photo. Staff receive the request by email and will call you with the next step." />
                <div className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-soft">
                  <h3 className="text-sm font-extrabold text-navy">Before you visit</h3>
                  <ul className="mt-3 space-y-2 text-sm text-ink">
                    <li>• Back up your data where possible.</li>
                    <li>• Bring the device and any relevant bill.</li>
                    <li>• Tell us about liquid or accidental damage.</li>
                    <li>• Do not share passcodes in the request form.</li>
                  </ul>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <RepairForm />
            </Reveal>
          </div>
        </Container>
      </section>

      <FAQ items={repairFaq} title="Repair questions" />
      <CTASection title="Need a fast repair assessment?" description="Message or call the team before travelling. We’re open daily until 10 PM at both Guwahati branches." />
    </>
  );
}
