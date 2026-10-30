import Link from 'next/link';
import { ArrowUpRight, Camera, Clock3, Mail, MapPin, Phone, Play, Star, Users } from 'lucide-react';
import { SmartImage } from '@/components/ui/SmartImage';
import { PaymentBadges } from '@/components/ui/PaymentBadges';
import { OpenStatusPill } from '@/components/branches/OpenStatusPill';
import { CallLink, DirectionsLink, WhatsAppLink } from '@/components/analytics/ContactLinks';
import { buttonStyles } from '@/components/ui/button-styles';
import { siteConfig } from '@/lib/config';
import { hoursSummary } from '@/lib/branch-hours';
import { displayPhone } from '@/lib/utils';
import type { Branch } from '@/lib/types';

const explore = [
  { href: '/new-phones', label: 'New Phones' },
  { href: '/second-hand-phones', label: 'Second-Hand Phones' },
  { href: '/accessories', label: 'Accessories & Gadgets' },
  { href: '/shop', label: 'All Live Stock' },
  { href: '/sell-exchange', label: 'Sell / Exchange' },
];

const services = [
  { href: '/repair', label: 'Repair Services' },
  { href: '/emi-payments', label: 'EMI & Payments' },
  { href: '/delivery-pickup', label: 'Delivery & Pickup' },
  { href: '/branches', label: 'Our Branches' },
  { href: '/contact', label: 'Contact Us' },
];

export function SiteFooter({ branches }: { branches: Branch[] }) {
  return (
    <footer className="border-t border-line bg-navy text-white">
      <div className="container-content grid gap-10 py-14 lg:grid-cols-[1.2fr_0.7fr_0.7fr_1.2fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="relative h-11 w-11 overflow-hidden rounded-xl bg-white">
              <SmartImage src={siteConfig.logo} alt="" fill sizes="44px" className="object-contain p-1" />
            </span>
            <span>
              <span className="block text-xl font-extrabold">F-Ex Store</span>
              <span className="block text-xs text-blue-200">Guwahati · Est. 2024</span>
            </span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-6 text-blue-100">
            New and pre-owned phones, accessories, gadgets, landline phones and reliable hardware
            repairs — with two convenient Guwahati branches open till 10 PM.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/15 p-2.5 hover:bg-white/10" aria-label="Instagram">
              <Camera className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/15 p-2.5 hover:bg-white/10" aria-label="Facebook">
              <Users className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/15 p-2.5 hover:bg-white/10" aria-label="YouTube">
              <Play className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href={siteConfig.social.googleReviews} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/15 p-2.5 hover:bg-white/10" aria-label="Google reviews">
              <Star className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-white">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-blue-100">
            {explore.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-orange">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-white">Services</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-blue-100">
            {services.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-orange">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-white">Visit or call</h2>
          <div className="mt-4 space-y-5">
            {branches.map((branch) => (
              <div key={branch.slug} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link href={`/branches/${branch.slug}`} className="font-bold hover:text-orange">
                    {branch.name}
                  </Link>
                  <OpenStatusPill branch={branch} inverse />
                </div>
                <p className="mt-2 flex gap-2 text-xs leading-5 text-blue-100">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {branch.address}
                </p>
                <p className="mt-1 flex items-center gap-2 text-xs text-blue-100">
                  <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                  {hoursSummary(branch)} IST
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <CallLink branch={branch} location="footer" label={displayPhone(branch.phone)} className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5 font-bold hover:bg-white/20" />
                  <DirectionsLink branch={branch} location="footer" label="Directions" className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5 font-bold hover:bg-white/20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-content flex flex-col gap-5 py-6 lg:flex-row lg:items-center lg:justify-between">
          <PaymentBadges size="sm" />
          <div className="flex flex-wrap gap-2">
            <WhatsAppLink
              branchSlug="lokhra"
              location="footer"
              label="WhatsApp"
              className={buttonStyles({ variant: 'primary', size: 'sm' })}
            />
            <a href={`mailto:${siteConfig.email}`} className={buttonStyles({ variant: 'white', size: 'sm' })}>
              <Mail className="h-4 w-4" aria-hidden="true" />
              Email
            </a>
            <a
              href={siteConfig.social.googleReviews}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles({ variant: 'outline', size: 'sm', className: 'border-white/20 bg-white/5 text-white hover:text-white' })}
            >
              <Star className="h-4 w-4" aria-hidden="true" />
              Google reviews
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-blue-200">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        <span className="mx-2">·</span>
        <Link href="/contact" className="hover:text-white">Contact</Link>
        <span className="mx-2">·</span>
        <Phone className="mr-1 inline h-3 w-3" aria-hidden="true" />
        Open daily till 10 PM
      </div>
    </footer>
  );
}
