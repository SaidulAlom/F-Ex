import Link from 'next/link';
import { ArrowUpRight, Clock3, MapPin } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { OpenStatusPill } from '@/components/branches/OpenStatusPill';
import { BranchMap } from '@/components/branches/BranchMap';
import { Badge } from '@/components/ui/Badge';
import { SmartImage } from '@/components/ui/SmartImage';
import { CallLink, DirectionsLink, WhatsAppLink } from '@/components/analytics/ContactLinks';
import { buttonStyles } from '@/components/ui/button-styles';
import { hoursSummary } from '@/lib/branch-hours';
import { displayPhone, isRealPhone } from '@/lib/utils';
import type { Branch } from '@/lib/types';

export function BranchCards({
  branches,
  showMap = true,
}: {
  branches: Branch[];
  showMap?: boolean;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {branches.map((branch, index) => (
        <Reveal key={branch.slug} delay={index * 0.08}>
          <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
            <div className="relative aspect-[16/8] overflow-hidden bg-cloud">
              <SmartImage
                src={branch.photo}
                alt={`Representative photograph of the ${branch.name} location`}
                fill
                sizes="(max-width: 1024px) 100vw, 580px"
                className="object-cover"
              />
              <div className="absolute left-4 top-4">
                <OpenStatusPill branch={branch} inverse showDetail />
              </div>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Badge tone="blue">{branch.pincode}</Badge>
                  <h2 className="mt-3 text-2xl font-bold text-navy">{branch.name}</h2>
                </div>
                <Link href={`/branches/${branch.slug}`} className="text-sm font-bold text-electric hover:underline">
                  Branch page <ArrowUpRight className="inline h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
              <p className="mt-3 flex gap-2 text-sm leading-6 text-ink">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-orange" aria-hidden="true" />
                {branch.address}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-ink">
                <Clock3 className="h-4 w-4 text-electric" aria-hidden="true" />
                {hoursSummary(branch)} IST · daily
              </p>
              <p className="mt-2 text-sm font-bold text-navy">
                {isRealPhone(branch.phone) ? displayPhone(branch.phone) : 'Phone number: add in lib/config.ts (TODO)'}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2 text-xs text-ink">
                {branch.highlights.map((highlight) => (
                  <li key={highlight} className="rounded-full bg-cloud px-3 py-1.5">{highlight}</li>
                ))}
              </ul>
              {showMap ? (
                <div className="mt-5 h-48 overflow-hidden rounded-2xl">
                  <BranchMap src={branch.mapEmbedUrl} title={branch.name} className="min-h-48 border-0" />
                </div>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-5">
                <CallLink
                  branch={branch}
                  location="branch-card"
                  label={isRealPhone(branch.phone) ? 'Call branch' : 'Call Lokhra'}
                  className={buttonStyles({ variant: 'primary', size: 'sm' })}
                />
                <DirectionsLink branch={branch} location="branch-card" className={buttonStyles({ variant: 'outline', size: 'sm' })} />
                <WhatsAppLink branchSlug={branch.slug} location="branch-card" label="WhatsApp" className={buttonStyles({ variant: 'navy', size: 'sm' })} />
              </div>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
