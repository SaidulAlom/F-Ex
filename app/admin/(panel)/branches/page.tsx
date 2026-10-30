import { redirect } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { BranchManager } from '@/components/admin/BranchManager';
import { getAdminUser } from '@/lib/api-auth';
import { getBranchesUncached } from '@/lib/data/content';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Branches' };

export default async function AdminBranchesPage() {
  const user = await getAdminUser();
  if (!user) redirect('/admin/login');
  if (user.role !== 'Owner') redirect('/admin?error=owner-only');
  const branches = await getBranchesUncached();
  return (
    <>
      <AdminPageHeader eyebrow="Locations" title="Branch details" description="Edit phone, address and opening hours. The public open/closed indicator uses these hours in IST." />
      <BranchManager branches={branches} userRole={user.role} />
    </>
  );
}
