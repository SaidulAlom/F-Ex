'use client';

import { CallLink, WhatsAppLink } from '@/components/analytics/ContactLinks';
import { getPrimaryBranch, siteConfig } from '@/lib/config';

export function MobileCallBar() {
  const primary = getPrimaryBranch();
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_30px_-20px_rgba(11,18,32,0.5)] backdrop-blur-xl lg:hidden"
      role="navigation"
      aria-label="Quick contact"
    >
      <div className="grid grid-cols-2 gap-2">
        <CallLink
          branch={primary}
          location="sticky-bottom-bar"
          label="Call now"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-3 py-3 text-sm font-extrabold text-white"
        />
        <WhatsAppLink
          branchSlug="lokhra"
          message={siteConfig.whatsapp.defaultMessage}
          location="sticky-bottom-bar"
          label="WhatsApp"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-3 text-sm font-extrabold text-white"
        />
      </div>

    </div>
  );
}
