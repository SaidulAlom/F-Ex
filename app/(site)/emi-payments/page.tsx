import { Banknote, CreditCard, Landmark, Smartphone } from 'lucide-react';
import { PageHero } from '@/components/content/PageHero';
import { CTASection } from '@/components/content/CTASection';
import { FAQ } from '@/components/content/FAQ';
import { FeatureCards } from '@/components/content/FeatureCards';
import { StepGrid } from '@/components/content/StepGrid';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PaymentBadges } from '@/components/ui/PaymentBadges';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { buttonStyles } from '@/components/ui/button-styles';
import { CallLink } from '@/components/analytics/ContactLinks';
import { getPrimaryBranch } from '@/lib/config';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 300;
export const metadata = buildMetadata({
  title: 'EMI & Payment Options in Guwahati',
  description: 'Pay for your phone with cash, Paytm UPI, PhonePe UPI, Visa, MasterCard, RuPay cards or EMI at F-Ex Store Lokhra and Basistha, Guwahati.',
  path: '/emi-payments',
});

const features = [
  { title: 'Cash', description: 'Simple in-store payment with a proper bill at either branch.', icon: Banknote },
  { title: 'UPI', description: 'We accept Paytm and PhonePe UPI for quick, secure payments.', icon: Smartphone },
  { title: 'Cards', description: 'Visa, MasterCard and RuPay cards are accepted in-store.', icon: CreditCard },
  { title: 'EMI', description: 'Spread eligible purchases into instalments through available finance partners.', icon: Landmark },
];

const steps = [
  { title: 'Choose your phone', description: 'Confirm live stock, condition, warranty and final price with the team.' },
  { title: 'Pick a payment route', description: 'Tell us whether you prefer UPI, card, cash or EMI before billing.' },
  { title: 'Check eligibility', description: 'EMI approval, tenure and charges depend on the finance provider and your profile.' },
  { title: 'Complete billing', description: 'Bring valid ID if required, complete payment, and collect your device.' },
];

const paymentFaq = [
  { q: 'Is EMI available on every phone?', a: 'EMI eligibility can depend on the product price, finance partner and documentation. Ask the branch for current options before purchase.' },
  { q: 'Are all UPI apps accepted?', a: 'Paytm and PhonePe are explicitly supported. Other UPI apps may work through standard UPI IDs — confirm at billing.' },
  { q: 'Do card payments have extra charges?', a: 'Any provider charges are explained before payment. Ask for the final payable amount on the bill.' },
  { q: 'Can I reserve a phone first?', a: 'Yes. Use the Reserve form on a product page and choose your preferred branch and pickup time.' },
];

export default function EmiPaymentsPage() {
  const primary = getPrimaryBranch();
  return (
    <>
      <PageHero
        eyebrow="Simple billing"
        title="Pay the way that works for you."
        description="Cash, UPI, cards and EMI options — with the final amount explained clearly before you pay."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'EMI & Payments', href: '/emi-payments' }]}
      >
        <PaymentBadges className="max-w-2xl" />
      </PageHero>

      <section className="bg-cloud py-14 sm:py-18">
        <Container>
          <Reveal><SectionHeading eyebrow="Accepted methods" title="Flexible payment at both branches." description="Choose a method at the counter. EMI is subject to provider approval and current scheme terms." /></Reveal>
          <div className="mt-9"><FeatureCards items={features} /></div>
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-18">
        <Container>
          <Reveal><SectionHeading eyebrow="How billing works" title="Four easy steps." description="No surprises — ask for the final payable amount before you approve the transaction." align="center" /></Reveal>
          <div className="mt-9"><StepGrid items={steps} /></div>
          <Reveal delay={0.1}>
            <div className="mt-9 rounded-2xl border border-line bg-cloud p-6 text-center">
              <h2 className="text-xl font-bold text-navy">Want to know your EMI eligibility?</h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-ink">Call the Lokhra team with the model you want. We’ll explain current finance options, required documents and the exact amount before you visit.</p>
              <div className="mt-5 flex justify-center">
                <CallLink branch={primary} location="emi-page" label="Ask about EMI" className={buttonStyles({ variant: 'primary' })} />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <FAQ items={paymentFaq} title="Payment questions" />
      <CTASection title="Choose your phone, then choose how to pay." description="Our team will help you compare devices and understand every eligible payment option before billing." />
    </>
  );
}
