import { Camera, Clock3, Mail, MapPin, Play, Star, Users } from 'lucide-react';
import { PageHero } from '@/components/content/PageHero';
import { FAQ } from '@/components/content/FAQ';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { ContactForm } from '@/components/forms/ContactForm';
import { BranchMap } from '@/components/branches/BranchMap';
import { OpenStatusPill } from '@/components/branches/OpenStatusPill';
import { CallLink, DirectionsLink, WhatsAppLink } from '@/components/analytics/ContactLinks';
import { buttonStyles } from '@/components/ui/button-styles';
import { siteConfig } from '@/lib/config';
import { hoursSummary } from '@/lib/branch-hours';
import { displayPhone, isRealPhone } from '@/lib/utils';
import { getBranches } from '@/lib/data/content';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 300;
export const metadata = buildMetadata({
  title: 'Contact F-Ex Store Guwahati',
  description: 'Call, WhatsApp, email or visit F-Ex Store in Lokhra or Basistha, Guwahati. Open daily until 10 PM. Send an enquiry and our team will reply.',
  path: '/contact',
});

const contactFaq = [
  { q: 'Which number should I call for Basistha?', a: 'The Basistha direct number is pending in the central config. Until it is supplied, the contact bar routes you to the Lokhra main line for both branches.' },
  { q: 'Can I confirm stock before travelling?', a: 'Yes. Use the product page reserve form, WhatsApp link or call button to confirm availability at your preferred branch.' },
  { q: 'How quickly will you reply to the form?', a: 'We reply during branch hours. For urgent stock or repair questions, WhatsApp or call is faster.' },
];

export default async function ContactPage() {
  const branches = await getBranches();
  return (
    <>
      <PageHero
        eyebrow="Talk to a real person"
        title="Questions? We’re open till 10 PM."
        description="Call, WhatsApp, email or send an enquiry. Tell us the phone or repair issue and we’ll point you in the right direction."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact', href: '/contact' }]}
      />

      <section className="bg-cloud py-14 sm:py-18">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
            <Reveal>
              <SectionHeading eyebrow="Send a message" title="Tell us what you need." description="The form includes spam protection and rate limiting. Your details are used only to respond to your enquiry." />
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <WhatsAppLink branchSlug="lokhra" location="contact-page" label="WhatsApp us" className={buttonStyles({ variant: 'primary' })} />
                <CallLink branch={branches[0]} location="contact-page" label="Call main line" className={buttonStyles({ variant: 'outline' })} />
              </div>
              <div className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-soft">
                <h3 className="text-sm font-extrabold text-navy">Other ways to connect</h3>
                <ul className="mt-3 space-y-3 text-sm text-ink">
                  <li><a href={`mailto:${siteConfig.email}`} className="inline-flex items-center gap-2 hover:text-electric"><Mail className="h-4 w-4" aria-hidden="true" />{siteConfig.email}</a></li>
                  <li><a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-electric"><Camera className="h-4 w-4" aria-hidden="true" />Instagram</a></li>
                  <li><a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-electric"><Users className="h-4 w-4" aria-hidden="true" />Facebook</a></li>
                  <li><a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-electric"><Play className="h-4 w-4" aria-hidden="true" />YouTube</a></li>
                  <li><a href={siteConfig.social.googleReviews} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-electric"><Star className="h-4 w-4" aria-hidden="true" />Google reviews</a></li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.08}><ContactForm /></Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-18">
        <Container>
          <Reveal><SectionHeading eyebrow="Find us" title="Two Guwahati locations." description="Maps use exact place links once the client adds them to lib/config.ts; the current embed uses nearby landmarks." /></Reveal>
          <div className="mt-9 grid gap-6 lg:grid-cols-2">
            {branches.map((branch, index) => (
              <Reveal key={branch.slug} delay={index * 0.08}>
                <article className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
                  <div className="h-56 bg-cloud">
                    <BranchMap src={branch.mapEmbedUrl} title={branch.name} className="min-h-56 rounded-none border-0" />
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-xl font-bold text-navy">{branch.name}</h3>
                      <OpenStatusPill branch={branch} />
                    </div>
                    <p className="mt-3 flex gap-2 text-sm leading-6 text-ink"><MapPin className="mt-1 h-4 w-4 shrink-0 text-orange" aria-hidden="true" />{branch.address}</p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-ink"><Clock3 className="h-4 w-4 text-electric" aria-hidden="true" />{hoursSummary(branch)} IST</p>
                    <p className="mt-2 text-sm font-bold text-navy">{isRealPhone(branch.phone) ? displayPhone(branch.phone) : 'Direct phone number coming soon'}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <CallLink branch={branch} location="contact-branch" label={isRealPhone(branch.phone) ? 'Call' : 'Call Lokhra'} className={buttonStyles({ variant: 'primary', size: 'sm' })} />
                      <DirectionsLink branch={branch} location="contact-branch" className={buttonStyles({ variant: 'outline', size: 'sm' })} />
                      <WhatsAppLink branchSlug={branch.slug} location="contact-branch" label="WhatsApp" className={buttonStyles({ variant: 'navy', size: 'sm' })} />
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <FAQ items={contactFaq} title="Contact questions" />
    </>
  );
}
