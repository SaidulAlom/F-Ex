import { redirect } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { LeadsTable } from '@/components/admin/LeadsTable';
import { getAdminUser } from '@/lib/api-auth';
import { branchScope } from '@/lib/permissions';
import { getLeads } from '@/lib/data/leads';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Leads' };

export default async function AdminLeadsPage() {
  const user = await getAdminUser();
  if (!user) redirect('/admin/login');
  const leads = await getLeads({ limit: 100, staffBranch: branchScope(user) });
  return (
    <>
      <AdminPageHeader eyebrow="Customer requests" title="Leads" description="Search every enquiry, repair request, reservation and sell waitlist submission. Move status from New → Contacted → Closed, or export CSV." />
      <LeadsTable initialLeads={leads} />
    </>
  );
}
