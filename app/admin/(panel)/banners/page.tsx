import { redirect } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { BannerManager } from '@/components/admin/BannerManager';
import { FeaturedProductsManager } from '@/components/admin/FeaturedProductsManager';
import { getAdminUser } from '@/lib/api-auth';
import { getAllBanners } from '@/lib/data/content';
import { getProductsUncached } from '@/lib/data/catalog';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Banners & Offers' };

export default async function AdminBannersPage() {
  const user = await getAdminUser();
  if (!user) redirect('/admin/login');
  if (user.role !== 'Owner') redirect('/admin?error=owner-only');
  const [banners, products] = await Promise.all([
    getAllBanners(),
    getProductsUncached({ limit: 100, page: 1, sort: 'featured' }),
  ]);
  return (
    <>
      <AdminPageHeader eyebrow="Homepage content" title="Banners, offers & featured products" description="Control hero and offer banners with active dates, and choose which products appear on the home page." />
      <BannerManager banners={banners} />
      <div className="mt-5"><FeaturedProductsManager products={products.items} /></div>
    </>
  );
}
