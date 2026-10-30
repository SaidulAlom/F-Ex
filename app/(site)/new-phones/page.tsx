import { CatalogPage } from '@/components/content/CatalogPage';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 300;
export const metadata = buildMetadata({
  title: 'New Phones in Guwahati',
  description: 'Shop new Apple, Vivo, Samsung, Redmi and other smartphones in Lokhra and Basistha, Guwahati. Warranty, EMI and same-day local delivery available.',
  path: '/new-phones',
});

export default async function NewPhonesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <CatalogPage
      eyebrow="New & sealed"
      title="New phones in Guwahati"
      description="Explore brand-new smartphones from Apple, Vivo, Samsung, Redmi and more. Confirm live availability at Lokhra or Basistha before you visit."
      basePath="/new-phones"
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'New Phones', href: '/new-phones' }]}
      searchParams={await searchParams}
      lockedCategory="new-phone"
    />
  );
}
