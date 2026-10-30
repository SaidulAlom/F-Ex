import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { siteConfig } from '@/lib/config';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin Login', robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect('/admin');
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy px-5 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center text-white">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange text-2xl font-extrabold">F</div>
          <h1 className="mt-4 text-2xl font-extrabold">F-Ex Store Admin</h1>
          <p className="mt-1 text-sm text-blue-200">Manage live stock, offers, leads and branches.</p>
        </div>
        <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-white/10" />}>
          <AdminLoginForm />
        </Suspense>
        <p className="mt-5 text-center text-xs text-blue-200">
          <Link href="/" className="hover:text-white">← Back to {siteConfig.name}</Link>
        </p>
      </div>
    </main>
  );
}
