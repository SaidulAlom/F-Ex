'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, Menu, Search, X } from 'lucide-react';
import { SearchBox } from '@/components/layout/SearchBox';
import { SmartImage } from '@/components/ui/SmartImage';
import { buttonStyles } from '@/components/ui/button-styles';
import { CallLink, WhatsAppLink } from '@/components/analytics/ContactLinks';
import { getPrimaryBranch, siteConfig } from '@/lib/config';
import { cn } from '@/lib/utils';

const mainLinks = [
  { href: '/new-phones', label: 'New Phones' },
  { href: '/second-hand-phones', label: 'Pre-Owned' },
  { href: '/accessories', label: 'Accessories' },
  { href: '/repair', label: 'Repairs' },
  { href: '/branches', label: 'Branches' },
];

const moreLinks = [
  { href: '/shop', label: 'All live stock' },
  { href: '/emi-payments', label: 'EMI & payments' },
  { href: '/delivery-pickup', label: 'Delivery & pickup' },
  { href: '/sell-exchange', label: 'Sell / exchange' },
  { href: '/about', label: 'About us' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [compact, setCompact] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const primary = getPrimaryBranch();

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMobileOpen(false);
      setSearchOpen(false);
      setMoreOpen(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/85 backdrop-blur-xl">
      <div className="container-content">
        <motion.div
          initial={false}
          animate={{ scale: reduced ? 1 : compact ? 0.96 : 1 }}
          style={{ originX: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'flex items-center justify-between gap-3',
            compact ? 'py-2' : 'py-3.5',
          )}
        >
          <Link href="/" className="focus-ring flex shrink-0 items-center gap-2.5 rounded-xl">
            <span className="relative h-10 w-10 overflow-hidden rounded-xl bg-navy">
              <SmartImage src={siteConfig.logo} alt="" fill sizes="40px" className="object-contain p-1" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg font-extrabold tracking-tight text-navy">
                F-Ex Store
              </span>
              <span className="hidden text-[10px] font-bold uppercase tracking-[0.15em] text-ink sm:block">
                Guwahati · Est. 2024
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 xl:flex" aria-label="Main navigation">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-lg px-2.5 py-2 text-[13px] font-bold text-ink hover:bg-cloud hover:text-electric',
                  pathname === link.href && 'bg-electric/8 text-electric',
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="relative">
              <button
                type="button"
                aria-expanded={moreOpen}
                aria-haspopup="menu"
                onClick={() => setMoreOpen((value) => !value)}
                className="focus-ring inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-[13px] font-bold text-ink hover:bg-cloud hover:text-electric"
              >
                More <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              {moreOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-line bg-white p-2 shadow-card"
                >
                  {moreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      role="menuitem"
                      className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-navy hover:bg-cloud"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </nav>

          <div className="hidden w-64 lg:block xl:w-56">
            <SearchBox />
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <CallLink
              branch={primary}
              location="header"
              label="Call"
              className={buttonStyles({ variant: 'outline', size: 'sm' })}
            />
            <WhatsAppLink
              branchSlug="lokhra"
              location="header"
              label="WhatsApp"
              className={buttonStyles({ variant: 'primary', size: 'sm' })}
            />
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <button
              type="button"
              onClick={() => setSearchOpen((value) => !value)}
              className="focus-ring rounded-xl border border-line p-2.5 text-navy"
              aria-label={searchOpen ? 'Close search' : 'Open search'}
              aria-expanded={searchOpen}
            >
              {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              className="focus-ring rounded-xl bg-navy p-2.5 text-white"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </motion.div>

        {searchOpen ? (
          <div className="border-t border-line py-3 lg:hidden">
            <SearchBox autoFocus onNavigate={() => setSearchOpen(false)} />
          </div>
        ) : null}
      </div>

      {mobileOpen ? (
        <div
          id="mobile-navigation"
          ref={mobilePanelRef}
          className="border-t border-line bg-white xl:hidden"
        >
          <nav className="container-content grid grid-cols-2 gap-2 py-4" aria-label="Mobile navigation">
            {[...mainLinks, ...moreLinks].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl bg-cloud px-3 py-3 text-sm font-bold text-navy hover:bg-electric hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="container-content grid grid-cols-2 gap-2 pb-4">
            <CallLink
              branch={primary}
              location="mobile-menu"
              label="Call now"
              className={buttonStyles({ variant: 'outline', size: 'sm' })}
            />
            <WhatsAppLink
              branchSlug="lokhra"
              location="mobile-menu"
              label="WhatsApp"
              className={buttonStyles({ variant: 'primary', size: 'sm' })}
            />
          </div>
        </div>
      ) : null}
    </header>
  );
}
