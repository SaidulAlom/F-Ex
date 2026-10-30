import { CatalogPage } from '@/components/content/CatalogPage';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 300;
export const metadata = buildMetadata({
  title: 'Second-Hand Phones in Guwahati',
  description: 'Certified second-hand phones in Guwahati with A/B/C condition grades, battery health, warranty details and transparent availability at F-Ex Store.',
  path: '/second-hand-phones',
});

export default async function SecondHandPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <CatalogPage
      eyebrow="Inspected pre-owned"
      title="Second-hand phones, clearly graded"
      description="Every pre-owned device lists its cosmetic grade, battery health and warranty. Reserved and Sold devices stay visible so you know exactly where you stand."
      basePath="/second-hand-phones"
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Second-Hand Phones', href: '/second-hand-phones' }]}
      searchParams={await searchParams}
      lockedCategory="second-hand"
    />
  );
}
