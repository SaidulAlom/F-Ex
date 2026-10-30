import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, Cloud, Database, Mail, Package, Users } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatCards } from '@/components/admin/AdminStatCards';
import { Badge } from '@/components/ui/Badge';
import { buttonStyles } from '@/components/ui/button-styles';
import { getAdminUser } from '@/lib/api-auth';
import { branchScope } from '@/lib/permissions';
import { getDashboardStats } from '@/lib/data/stats';
import { getLeads } from '@/lib/data/leads';
import { cloudinaryConfig, isDatabaseConfigured, isDemoMode, resendConfig } from '@/lib/env';
import { formatDateTime } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Dashboard' };

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getAdminUser();
  if (!user) redirect('/admin/login');
  const params = await searchParams;
  const staffBranch = branchScope(user);
  const [stats, leads] = await Promise.all([
    getDashboardStats(staffBranch),
    getLeads({ limit: 5, staffBranch }),
  ]);
  const integrations = [
    { label: 'MongoDB', ok: isDatabaseConfigured(), detail: isDemoMode() ? 'Demo fallback active' : 'Connected / configured', icon: Database },
    { label: 'Cloudinary', ok: Boolean(cloudinaryConfig()), detail: 'Signed product & repair uploads', icon: Cloud },
    { label: 'Resend', ok: Boolean(resendConfig()), detail: 'Staff lead email alerts', icon: Mail },
    { label: 'GA4', ok: Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.startsWith('G-') && !process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.includes('XXXX')), detail: 'Call, WhatsApp, directions & forms', icon: Users },
  ];

  return (
    <>
      <AdminPageHeader
        eyebrow="Overview"
        title={`Welcome back${user.name ? `, ${user.name.split(' ')[0]}` : ''}.`}
        description="Update stock, publish offers, reply to leads and keep both Guwahati branches accurate."
        action={
          <>
            <Link href="/admin/products/new" className={buttonStyles({ variant: 'primary', size: 'sm' })}><Package className="h-4 w-4" aria-hidden="true" />Add product</Link>
            <Link href="/admin/leads" className={buttonStyles({ variant: 'outline', size: 'sm' })}><Users className="h-4 w-4" aria-hidden="true" />View leads</Link>
          </>
        }
      />

      {params.error === 'owner-only' ? <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">That section requires Owner access.</div> : null}

      <AdminStatCards stats={stats} />

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-navy">Recent leads</h2>
            <Link href="/admin/leads" className="inline-flex items-center gap-1 text-xs font-bold text-electric">All leads <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
          </div>
          <div className="mt-4 divide-y divide-line">
            {leads.length ? leads.map((lead) => (
              <div key={lead.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="text-sm font-bold text-navy">{lead.name}</p>
                  <p className="text-xs text-ink">{lead.type} · {lead.branch} · {formatDateTime(lead.createdAt)}</p>
                </div>
                <Badge tone={lead.status === 'New' ? 'orange' : lead.status === 'Contacted' ? 'blue' : 'green'}>{lead.status}</Badge>
              </div>
            )) : <p className="py-6 text-sm text-ink">No leads yet. Public form submissions will appear here.</p>}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-navy">System status</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {integrations.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-xl border border-line bg-cloud p-4">
                  <div className="flex items-center justify-between gap-2">
                    <Icon className="h-4 w-4 text-electric" aria-hidden="true" />
                    <Badge tone={item.ok ? 'green' : 'slate'}>{item.ok ? 'Ready' : 'Setup'}</Badge>
                  </div>
                  <p className="mt-3 text-sm font-bold text-navy">{item.label}</p>
                  <p className="mt-1 text-xs text-ink">{item.detail}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-4 rounded-xl bg-navy p-4 text-white">
            <p className="text-sm font-bold">Fast stock workflow</p>
            <p className="mt-1 text-xs leading-5 text-blue-100">Open Products → change the status dropdown to Reserved or Sold. The public catalogue is purged by cache tag immediately.</p>
          </div>
        </section>
      </div>
    </>
  );
}
