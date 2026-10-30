import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { AdminShell } from '@/components/admin/AdminShell';
import { authOptions } from '@/lib/auth';
import { isDatabaseConfigured, isDemoMode } from '@/lib/env';

export const dynamic = 'force-dynamic';

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/admin/login');
  return (
    <AdminShell
      user={{
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        branch: session.user.branch,
      }}
      demoMode={isDemoMode()}
      databaseConfigured={isDatabaseConfigured()}
    >
      {children}
    </AdminShell>
  );
}
