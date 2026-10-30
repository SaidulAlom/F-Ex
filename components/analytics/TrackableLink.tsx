'use client';

import Link from 'next/link';
import { trackEvent, type AnalyticsParams } from '@/lib/analytics';

export function TrackableLink({
  href,
  event,
  params = {},
  children,
  className,
  ariaLabel,
  external = false,
  onClick,
}: {
  href: string;
  event: string;
  params?: AnalyticsParams;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  external?: boolean;
  onClick?: () => void;
}) {
  const handleClick = () => {
    trackEvent(event, params);
    onClick?.();
  };
  const common = {
    className,
    'aria-label': ariaLabel,
    onClick: handleClick,
  };

  const isSpecialScheme = /^(tel:|mailto:|sms:)/.test(href);
  if (isSpecialScheme) {
    return (
      <a href={href} {...common}>
        {children}
      </a>
    );
  }
  if (external || !href.startsWith('/')) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...common}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...common}>
      {children}
    </Link>
  );
}
