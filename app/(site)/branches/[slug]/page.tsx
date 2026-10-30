import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Clock3, MapPin, Navigation, PhoneCall, Store } from 'lucide-react';
import { PageHero } from '@/components/content/PageHero';
import { CTASection } from '@/components/content/CTASection';
import { BranchMap } from '@/components/branches/BranchMap';
import { BranchCards } from '@/components/branches/BranchCards';
import { OpenStatusPill } from '@/components/branches/OpenStatusPill';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Reveal } from '@/components/motion/Reveal';
import { CallLink, DirectionsLink, WhatsAppLink } from '@/components/analytics/ContactLinks';
import { buttonStyles } from '@/components/ui/button-styles';
import { getBranchBySlug, getBranches } from '@/lib/data/content';
import { branchSlugs } from '@/lib/config';
import { formatTime, hoursSummary } from '@/lib/branch-hours';
import { displayPhone, isRealPhone } from '@/lib/utils';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 300;
export const dynamicParams = false;

export async function generateStaticParams() {
  return branchSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const branch = await getBranchBySlug(slug);
  if (!branch) return buildMetadata({ title: 'Branch not found', description: 'Branch not found', path: '/branches', noIndex: true });
  return buildMetadata({
    title: `${branch.name}, Guwahati`,
    description: `${branch.name} — ${branch.address}. Open ${hoursSummary(branch)} IST. View map, directions, phone, WhatsApp and live open/closed status.`,
    path: `/branches/${branch.slug}`,
    image: branch.photo,
  });
}

export default async function BranchDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [branch, branches] = await Promise.all([getBranchBySlug(slug), getBranches()]);
  if (!branch) notFound();
  const otherBranches = branches.filter((item) => item.slug !== branch.slug);

  return (
    <>
      <PageHero
        eyebrow={`${branch.pincode} · Guwahati, Assam`}
        title={branch.name}
        description={branch.address}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Branches', href: '/branches' },
          { label: branch.slug === 'lokhra' ? 'Lokhra' : 'Basistha', href: `/branches/${branch.slug}` },
        ]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <OpenStatusPill branch={branch} inverse showDetail />
          <Badge tone="white">{hoursSummary(branch)} IST</Badge>
        </div>
      </PageHero>

      <section className="bg-cloud py-14 sm:py-18">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <Reveal>
              <div className="h-full min-h-96 overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
                <BranchMap src={branch.mapEmbedUrl} title={branch.name} className="min-h-96 rounded-none border-0" />
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-2xl font-bold text-navy">Plan your visit</h2>
                  <OpenStatusPill branch={branch} />
                </div>
                <div className="mt-6 space-y-4 text-sm text-ink">
                  <p className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-orange" aria-hidden="true" /><span>{branch.addressLines.map((line) => <span key={line} className="block">{line}</span>)}</span></p>
                  <p className="flex items-center gap-3"><Clock3 className="h-5 w-5 shrink-0 text-electric" aria-hidden="true" /><span>{hoursSummary(branch)} IST, every day</span></p>
                  <p className="flex items-center gap-3"><PhoneCall className="h-5 w-5 shrink-0 text-electric" aria-hidden="true" /><span>{isRealPhone(branch.phone) ? displayPhone(branch.phone) : 'Direct branch number to be added in lib/config.ts'}</span></p>
                  <p className="flex items-center gap-3"><Store className="h-5 w-5 shrink-0 text-electric" aria-hidden="true" /><span>New & pre-owned phones, accessories and repair desk</span></p>
                </div>
                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  <CallLink branch={branch} location="branch-page" label={isRealPhone(branch.phone) ? 'Click to call' : 'Call Lokhra main line'} className={buttonStyles({ variant: 'primary' })} />
                  <DirectionsLink branch={branch} location="branch-page" label="Get directions" className={buttonStyles({ variant: 'orange' })} />
                  <WhatsAppLink branchSlug={branch.slug} location="branch-page" label="WhatsApp branch" className={buttonStyles({ variant: 'navy' })} />
                  <Link href={`/shop?branch=${branch.slug}`} className={buttonStyles({ variant: 'outline' })}>
                    Stock here <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
                <div className="mt-6 rounded-xl bg-cloud p-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wide text-ink">Opening hours</h3>
                  <ul className="mt-2 space-y-1.5">
                    {branch.hours.map((slot) => (
                      <li key={`${slot.label}-${slot.open}`} className="flex items-center justify-between gap-3 text-sm">
                        <span className="font-semibold text-navy">{slot.label}</span>
                        <span className="text-ink">{formatTime(slot.open)} – {formatTime(slot.close)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-18">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Local mobile shop"
              title={branch.slug === 'lokhra' ? 'Your phone store beside Sarusajai Stadium.' : 'Your phone store near Lakhi Mandir.'}
              description="Confirm live stock before travelling, choose a pickup time, or ask about same-day local delivery. All opening calculations use Asia/Kolkata / IST."
            />
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {branch.highlights.map((highlight) => (
              <div key={highlight} className="rounded-2xl border border-line bg-cloud p-5">
                <Navigation className="h-5 w-5 text-orange" aria-hidden="true" />
                <p className="mt-4 text-sm font-bold text-navy">{highlight}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-cloud py-14 sm:py-18">
        <Container>
          <Reveal><SectionHeading eyebrow="Other location" title="Our second Guwahati branch." /></Reveal>
          <div className="mt-9"><BranchCards branches={otherBranches} showMap={false} /></div>
        </Container>
      </section>

      <CTASection title={`Need directions to ${branch.slug === 'lokhra' ? 'Lokhra' : 'Basistha'}?`} description="Open Google Maps from the button above, or call the team and we’ll guide you to the store." />
    </>
  );
}
