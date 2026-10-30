import { redirect } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ProductForm } from '@/components/admin/ProductForm';
import { getAdminUser } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Add Product' };

export default async function NewProductPage() {
  const user = await getAdminUser();
  if (!user) redirect('/admin/login');
  return (
    <>
      <AdminPageHeader eyebrow="Quick add" title="Add a product" description="Default values and a demo product photograph are pre-filled. Fill the essentials, publish, then refine later." />
      <ProductForm userRole={user.role} userBranch={user.branch} />
    </>
  );
}
