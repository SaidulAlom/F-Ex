import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { absoluteUrl } from '@/lib/utils';
import { jsonLd } from '@/lib/seo';

export function Breadcrumbs({
  items,
}: {
  items: { label: string; href: string }[];
}) {
  const structured = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structured) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1 text-xs font-semibold text-ink">
          {items.map((item, index) => (
            <li key={`${item.href}-${item.label}`} className="flex items-center gap-1">
              {index > 0 ? <ChevronRight className="h-3 w-3" aria-hidden="true" /> : null}
              {index === items.length - 1 ? (
                <span aria-current="page" className="text-navy">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-electric">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
