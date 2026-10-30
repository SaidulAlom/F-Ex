import { notFound, redirect } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ProductForm } from '@/components/admin/ProductForm';
import { getAdminUser } from '@/lib/api-auth';
import { getProductById } from '@/lib/data/catalog';
import { canManageBranch } from '@/lib/permissions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Edit Product' };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, user] = await Promise.all([params, getAdminUser()]);
  if (!user) redirect('/admin/login');
  const product = await getProductById(id);
  if (!product) notFound();
  if (!canManageBranch(user, product.branch)) redirect('/admin/products?error=You%20can%20only%20edit%20your%20branch%20stock');
  return (
    <>
      <AdminPageHeader eyebrow="Edit listing" title={product.title} description="Saving will immediately revalidate the public product and listing pages." />
      <ProductForm product={product} userRole={user.role} userBranch={user.branch} />
    </>
  );
}
