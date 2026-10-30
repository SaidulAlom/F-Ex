'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  ExternalLink,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  MessageSquareQuote,
  Package,
  Users,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { buttonStyles } from '@/components/ui/button-styles';
import type { AdminRole, ProductBranch } from '@/lib/types';
import { cn } from '@/lib/utils';

const ownerLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/banners', label: 'Banners & offers', icon: ImageIcon },
  { href: '/admin/leads', label: 'Leads', icon: Users },
  { href: '/admin/branches', label: 'Branches', icon: MapPin },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
];

export function AdminShell({
  children,
  user,
  demoMode,
  databaseConfigured,
}: {
  children: React.ReactNode;
  user: { name?: string | null; email?: string | null; role: AdminRole; branch: ProductBranch };
  demoMode: boolean;
  databaseConfigured: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = user.role === 'Owner' ? ownerLinks : ownerLinks.filter((link) => !['/admin/banners', '/admin/branches', '/admin/testimonials'].includes(link.href));

  return (
    <div className="min-h-screen bg-cloud">
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setOpen((value) => !value)} className="rounded-xl border border-line p-2 text-navy lg:hidden" aria-label="Toggle admin navigation" aria-expanded={open}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href="/admin" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-sm font-extrabold text-white">F</span>
              <span className="text-sm font-extrabold text-navy">F-Ex Admin</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone={user.role === 'Owner' ? 'blue' : 'orange'}>{user.role}</Badge>
            <a href="/" target="_blank" rel="noopener noreferrer" className={buttonStyles({ variant: 'outline', size: 'sm' })}>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">View site</span>
            </a>
            <button type="button" onClick={() => signOut({ callbackUrl: '/admin/login' })} className={buttonStyles({ variant: 'navy', size: 'sm' })}>
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1500px]">
        <aside className={cn('fixed inset-y-0 left-0 z-50 w-72 border-r border-line bg-white p-4 pt-20 transition-transform duration-200 lg:sticky lg:top-[65px] lg:z-0 lg:h-[calc(100vh-65px)] lg:translate-x-0 lg:pt-4', open ? 'translate-x-0' : '-translate-x-full')}>
          <div className="mb-5 rounded-xl bg-cloud p-3">
            <p className="truncate text-sm font-bold text-navy">{user.name || user.email || 'Admin user'}</p>
            <p className="truncate text-xs text-ink">{user.email}</p>
            <p className="mt-1 text-xs font-semibold text-electric">Branch scope: {user.branch}</p>
          </div>
          <nav aria-label="Admin navigation" className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(`${link.href}/`));
              return (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold', active ? 'bg-electric text-white' : 'text-ink hover:bg-cloud hover:text-navy')}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-6 rounded-xl border border-line bg-cloud p-3 text-xs leading-5 text-ink">
            <p className="font-bold text-navy">Quick stock update</p>
            <p className="mt-1">Open Products, change the status dropdown, and the public site revalidates immediately.</p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {!databaseConfigured ? (
            <div className={cn('mb-5 rounded-xl border px-4 py-3 text-sm font-semibold', demoMode ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-red-200 bg-red-50 text-red-700')}>
              {demoMode
                ? 'DEMO MODE: MongoDB is not connected. Admin edits are stored only in this server process and will reset. Add MONGODB_URI and run npm run seed for production.'
                : 'MongoDB is not configured. Add MONGODB_URI to environment variables before using the admin panel.'}
            </div>
          ) : null}
          {children}
        </main>
      </div>
    </div>
  );
}
