import { PageHero } from '@/components/content/PageHero';
import { CTASection } from '@/components/content/CTASection';
import { ProductExplorer } from '@/components/products/ProductExplorer';
import { getProductFacets, getProducts } from '@/lib/data/catalog';
import { parseProductQuery } from '@/lib/query';
import type { ProductCategory, ProductQuery } from '@/lib/types';

type SearchParams = Record<string, string | string[] | undefined>;

export async function CatalogPage({
  eyebrow,
  title,
  description,
  basePath,
  breadcrumbs,
  searchParams,
  lockedCategory,
  lockedCategories,
}: {
  eyebrow: string;
  title: string;
  description: string;
  basePath: string;
  breadcrumbs: { label: string; href: string }[];
  searchParams: SearchParams;
  lockedCategory?: ProductCategory;
  lockedCategories?: ProductCategory[];
}) {
  const overrides: Partial<ProductQuery> = { limit: 9 };
  if (lockedCategory) overrides.category = lockedCategory;
  if (lockedCategories?.length) {
    overrides.categories = lockedCategories;
    if (!searchParams.category) overrides.category = undefined;
  }
  const query = parseProductQuery(searchParams, overrides);
  const [result, facets] = await Promise.all([
    getProducts(query),
    getProductFacets(),
  ]);

  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={description} breadcrumbs={breadcrumbs} />
      <section className="bg-cloud py-10 sm:py-14">
        <div className="container-content">
          <ProductExplorer
            result={result}
            facets={facets}
            query={query}
            basePath={basePath}
            lockedCategory={lockedCategory}
            lockedCategories={lockedCategories}
          />
        </div>
      </section>
      <CTASection />
    </>
  );
}
