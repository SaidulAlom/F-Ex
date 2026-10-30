import { CatalogPage } from '@/components/content/CatalogPage';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 300;
export const metadata = buildMetadata({
  title: 'All Live Stock',
  description: 'Browse all new phones, second-hand phones, accessories, gadgets and landline phones available at F-Ex Store in Guwahati.',
  path: '/shop',
});

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <CatalogPage
      eyebrow="Live inventory"
      title="All phones, accessories & gadgets"
      description="Filter the full F-Ex Store catalogue by category, brand, price, condition and availability. Stock is updated from the admin panel."
      basePath="/shop"
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'All stock', href: '/shop' }]}
      searchParams={await searchParams}
    />
  );
}
