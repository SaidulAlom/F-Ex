import { Clock3, MapPin, PhoneCall, Store } from 'lucide-react';
import Link from 'next/link';
import { PageHero } from '@/components/content/PageHero';
import { CTASection } from '@/components/content/CTASection';
import { FAQ } from '@/components/content/FAQ';
import { BranchCards } from '@/components/branches/BranchCards';
import { OpenStatusPill } from '@/components/branches/OpenStatusPill';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { buttonStyles } from '@/components/ui/button-styles';
import { getBranches } from '@/lib/data/content';
import { hoursSummary } from '@/lib/branch-hours';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 300;
export const metadata = buildMetadata({
  title: 'Mobile Shop in Lokhra & Basistha, Guwahati',
  description: 'Visit F-Ex Store at Lokhra or Basistha, Guwahati. See live open/closed status, exact branch hours, maps, directions and click-to-call options.',
  path: '/branches',
});

const branchFaq = [
  { q: 'Are both branches open on Sunday?', a: 'Yes. Lokhra and Basistha are open Monday to Sunday, with closing time at 10 PM IST.' },
  { q: 'Which branch has my phone?', a: 'Each product lists Lokhra, Basistha or both. You can also filter live stock by branch using the product links.' },
  { q: 'Can I get directions?', a: 'Yes. Every branch card and branch page has a Get Directions button that opens Google Maps and tracks the click in GA4.' },
];

export default async function BranchesPage() {
  const branches = await getBranches();
  return (
    <>
      <PageHero
        eyebrow="Two Guwahati branches"
        title="Find a mobile shop near you."
        description="F-Ex Store serves Lokhra, Basistha and nearby Guwahati neighbourhoods with live stock, repairs, accessories and late daily opening hours."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Branches', href: '/branches' }]}
      />

      <section className="bg-cloud py-14 sm:py-18">
        <Container>
          <Reveal><SectionHeading eyebrow="Live status" title="Pick the branch that suits you." description="Open/closed pills are calculated in the IST timezone and refresh every minute." /></Reveal>
          <div className="mt-9"><BranchCards branches={branches} /></div>
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-18">
        <Container>
          <Reveal><SectionHeading eyebrow="At a glance" title="Hours, phones and service areas." description="All branch data originates in lib/config.ts; admin edits override hours, phone and address in MongoDB." /></Reveal>
          <div className="mt-9 overflow-x-auto rounded-2xl border border-line shadow-soft">
            <table className="w-full min-w-[720px] border-collapse bg-white text-left text-sm">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="p-4 font-bold">Branch</th>
                  <th className="p-4 font-bold">Live status</th>
                  <th className="p-4 font-bold">Hours (IST)</th>
                  <th className="p-4 font-bold">Phone</th>
                  <th className="p-4 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {branches.map((branch) => (
                  <tr key={branch.slug}>
                    <td className="p-4">
                      <span className="flex items-center gap-2 font-bold text-navy"><Store className="h-4 w-4 text-electric" aria-hidden="true" />{branch.name}</span>
                      <span className="mt-1 flex items-start gap-1 text-xs text-ink"><MapPin className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />{branch.pincode}</span>
                    </td>
                    <td className="p-4"><OpenStatusPill branch={branch} /></td>
                    <td className="p-4"><span className="inline-flex items-center gap-1.5 text-ink"><Clock3 className="h-4 w-4 text-electric" aria-hidden="true" />{hoursSummary(branch)}</span></td>
                    <td className="p-4"><span className="inline-flex items-center gap-1.5 text-ink"><PhoneCall className="h-4 w-4 text-orange" aria-hidden="true" />{branch.phone.includes('TODO') ? 'To be added' : branch.phone}</span></td>
                    <td className="p-4"><Link href={`/branches/${branch.slug}`} className={buttonStyles({ variant: 'outline', size: 'sm' })}>Branch details</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <section className="bg-cloud py-14 sm:py-18">
        <Container>
          <Reveal>
            <div className="rounded-2xl border border-line bg-white p-7 shadow-soft">
              <h2 className="text-2xl font-bold text-navy">Serving mobile buyers across Guwahati</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-ink">
                If you’re searching for a “mobile shop in Lokhra”, “mobile shop in Basistha” or a trusted phone showroom in Guwahati, our two branches are easy to reach. Reserve a device online, confirm live availability, then choose pickup, same-day local delivery or eligible free delivery.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <FAQ items={branchFaq} title="Branch questions" />
      <CTASection title="Call before you travel." description="Stock can change quickly. A quick call or WhatsApp message confirms the exact model, branch and payment options." />
    </>
  );
}
