'use client';

import { MessageCircle, Navigation, Phone } from 'lucide-react';
import { GA_EVENTS } from '@/lib/analytics';
import { displayPhone, telHref, whatsappLink } from '@/lib/utils';
import { getPrimaryBranch } from '@/lib/config';
import { TrackableLink } from '@/components/analytics/TrackableLink';
import type { Branch } from '@/lib/types';

type LinkBranch = Pick<Branch, 'slug' | 'name' | 'phone' | 'directionsUrl'>;

export function CallLink({
  branch,
  className,
  label,
  ariaLabel,
  location = 'unknown',
}: {
  branch: Pick<Branch, 'slug' | 'name' | 'phone'>;
  className?: string;
  label?: React.ReactNode;
  ariaLabel?: string;
  location?: string;
}) {
  const hasBranchPhone = Boolean(telHref(branch.phone));
  const primary = getPrimaryBranch();
  const phone = hasBranchPhone ? branch.phone : primary.phone;
  const href = telHref(phone) || '/contact';
  return (
    <TrackableLink
      href={href}
      event={GA_EVENTS.callClick}
      params={{ branch: branch.slug, link_location: location }}
      className={className}
      ariaLabel={ariaLabel || `Call ${branch.name}`}
    >
      <Phone className="h-4 w-4" aria-hidden="true" />
      {label || (hasBranchPhone ? displayPhone(phone) : 'Call our Lokhra main line')}
    </TrackableLink>
  );
}

export function WhatsAppLink({
  branchSlug,
  message,
  className,
  label = 'WhatsApp us',
  ariaLabel,
  location = 'unknown',
  productSlug,
}: {
  branchSlug?: string;
  message?: string;
  className?: string;
  label?: React.ReactNode;
  ariaLabel?: string;
  location?: string;
  productSlug?: string;
}) {
  return (
    <TrackableLink
      href={whatsappLink(message || 'Hello F-Ex Store, I have a question.', branchSlug)}
      external
      event={GA_EVENTS.whatsappClick}
      params={{ branch: branchSlug || 'general', link_location: location, product: productSlug }}
      className={className}
      ariaLabel={ariaLabel || (typeof label === 'string' ? label : 'Chat with F-Ex Store on WhatsApp')}
    >
      <MessageCircle className="h-4 w-4" aria-hidden="true" />
      {label}
    </TrackableLink>
  );
}

export function DirectionsLink({
  branch,
  className,
  label = 'Get directions',
  location = 'unknown',
}: {
  branch: LinkBranch;
  className?: string;
  label?: string;
  location?: string;
}) {
  return (
    <TrackableLink
      href={branch.directionsUrl}
      external
      event={GA_EVENTS.directionsClick}
      params={{ branch: branch.slug, link_location: location }}
      className={className}
      ariaLabel={`Get directions to ${branch.name}`}
    >
      <Navigation className="h-4 w-4" aria-hidden="true" />
      {label}
    </TrackableLink>
  );
}
