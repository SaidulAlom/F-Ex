import { CatalogPage } from '@/components/content/CatalogPage';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 300;
export const metadata = buildMetadata({
  title: 'Accessories, Gadgets & Landline Phones',
  description: 'Shop chargers, cables, earbuds, gadgets and landline phones at F-Ex Store Lokhra and Basistha, Guwahati.',
  path: '/accessories',
});

export default async function AccessoriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <CatalogPage
      eyebrow="Everyday essentials"
      title="Accessories, gadgets & landline phones"
      description="Find chargers, cables, audio, useful gadgets and corded or cordless landline phones. Use the category filter to narrow the shelf."
      basePath="/accessories"
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Accessories', href: '/accessories' }]}
      searchParams={await searchParams}
      lockedCategories={['accessory', 'gadget', 'landline']}
    />
  );
}
