import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Plus } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminProductTable } from '@/components/admin/AdminProductTable';
import { buttonStyles } from '@/components/ui/button-styles';
import { getAdminUser } from '@/lib/api-auth';
import { branchScope } from '@/lib/permissions';
import { getProductsUncached } from '@/lib/data/catalog';
import { parseProductQuery } from '@/lib/query';
import { first } from '@/lib/utils';
import type { ProductQuery } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Products' };

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getAdminUser();
  if (!user) redirect('/admin/login');
  const params = await searchParams;
  const staffBranch = branchScope(user);
  const overrides: Partial<ProductQuery> = { limit: 100, page: 1 };
  if (staffBranch) overrides.branch = staffBranch;
  const query = parseProductQuery(params, overrides);
  const result = await getProductsUncached(query);

  return (
    <>
      <AdminPageHeader
        eyebrow="Inventory"
        title="Products & live stock"
        description="Add a product in under a minute, upload multiple images, change status inline, or edit full specifications."
        action={<Link href="/admin/products/new" className={buttonStyles({ variant: 'primary', size: 'sm' })}><Plus className="h-4 w-4" aria-hidden="true" />Add product</Link>}
      />
      {first(params.saved) ? <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">Product saved. Public catalogue cache has been revalidated.</div> : null}
      {first(params.error) ? <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">{first(params.error)}</div> : null}

      <form method="GET" action="/admin/products" className="mb-4 grid gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm sm:grid-cols-[1fr_220px_auto]">
        <label className="block">
          <span className="sr-only">Search products</span>
          <input name="q" defaultValue={query.q || ''} className="admin-input" placeholder="Search title or brand…" />
        </label>
        <label className="block">
          <span className="sr-only">Status</span>
          <select name="status" defaultValue={query.status || ''} className="admin-input">
            <option value="">All statuses</option>
            <option value="Available">Available</option>
            <option value="Reserved">Reserved</option>
            <option value="Sold">Sold</option>
          </select>
        </label>
        <button type="submit" className={buttonStyles({ variant: 'navy' })}>Filter</button>
      </form>

      <AdminProductTable products={result.items} userRole={user.role} />
    </>
  );
}
