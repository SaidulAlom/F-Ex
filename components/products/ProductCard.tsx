'use client';

import Link from 'next/link';
import { ArrowUpRight, Eye, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { SmartImage } from '@/components/ui/SmartImage';
import { CallLink, WhatsAppLink } from '@/components/analytics/ContactLinks';
import { buttonStyles } from '@/components/ui/button-styles';
import { CATEGORY_OPTIONS } from '@/lib/constants';
import { getPrimaryBranch } from '@/lib/config';
import { useOrigin } from '@/hooks/use-origin';
import { buildProductWhatsAppMessage, cn, priceLabel } from '@/lib/utils';
import type { Product } from '@/lib/types';

const branchLabel: Record<Product['branch'], string> = {
  lokhra: 'Lokhra',
  basistha: 'Basistha',
  both: 'Both branches',
};

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const origin = useOrigin();
  const primary = getPrimaryBranch();
  const category = CATEGORY_OPTIONS.find((item) => item.value === product.category);
  const image = product.images[0];

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition-transform duration-200 hover:-translate-y-1 focus-within:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-cloud">
        <Link
          href={`/product/${product.slug}`}
          className="block h-full w-full"
          aria-label={`View ${product.title}`}
        >
          <SmartImage
            src={image?.url || '/images/products/generic-product.webp'}
            alt={image?.alt || product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge tone="white">{category?.shortLabel || product.category}</Badge>
          {product.grade ? <Badge tone="orange">Grade {product.grade}</Badge> : null}
        </div>
        {product.status !== 'Available' ? (
          <div
            className={cn(
              'absolute right-0 top-4 rotate-[8deg] rounded-l-lg px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg',
              product.status === 'Sold' ? 'bg-red-600' : 'bg-amber-500',
            )}
          >
            {product.status}
          </div>
        ) : null}

        {/* Quick-view panel: transform + opacity only, also opens on keyboard focus. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-navy/95 p-4 text-white opacity-0 transition duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-100">
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              Quick view
            </span>
            <span className="text-xs text-blue-100">{product.condition}</span>
          </div>
          <p className="line-clamp-2 text-sm leading-5 text-blue-100">{product.shortDescription}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-blue-100">
            {product.specs.ram ? <span>{product.specs.ram} RAM</span> : null}
            {product.specs.storage ? <span>· {product.specs.storage}</span> : null}
            {product.batteryHealth ? <span>· Battery {product.batteryHealth}</span> : null}
          </div>
          <div className="mt-4 flex gap-2">
            <Link
              href={`/product/${product.slug}`}
              className={buttonStyles({ variant: 'white', size: 'sm', className: 'flex-1' })}
            >
              Full details <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <WhatsAppLink
              branchSlug={product.branch === 'basistha' ? 'basistha' : 'lokhra'}
              message={buildProductWhatsAppMessage(product, origin)}
              productSlug={product.slug}
              location="product-quick-view"
              label="WhatsApp"
              className={buttonStyles({ variant: 'primary', size: 'sm', className: 'flex-1' })}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wide text-electric">{product.brand}</p>
            <h3 className="mt-1 line-clamp-2 text-base font-bold leading-6 text-navy">
              <Link href={`/product/${product.slug}`} className="hover:text-electric">
                {product.title}
              </Link>
            </h3>
          </div>
          {product.featured ? <Badge tone="blue">Featured</Badge> : null}
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xl font-extrabold text-navy">{priceLabel(product)}</p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-ink">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              {branchLabel[product.branch]}
            </p>
          </div>
          <Badge
            tone={
              product.status === 'Available'
                ? 'green'
                : product.status === 'Reserved'
                  ? 'orange'
                  : 'red'
            }
          >
            {product.status}
          </Badge>
        </div>

        <div className="mt-4 flex gap-2 border-t border-line pt-4">
          <Link
            href={`/product/${product.slug}`}
            className={buttonStyles({ variant: 'outline', size: 'sm', className: 'flex-1' })}
          >
            View details
          </Link>
          {product.callForPrice ? (
            <CallLink
              branch={primary}
              location="product-card"
              label={<><Phone className="h-4 w-4" aria-hidden="true" />Call</>}
              ariaLabel={`Call about ${product.title}`}
              className={buttonStyles({ variant: 'navy', size: 'sm', className: 'flex-1' })}
            />
          ) : (
            <WhatsAppLink
              branchSlug={product.branch === 'basistha' ? 'basistha' : 'lokhra'}
              message={buildProductWhatsAppMessage(product, origin)}
              productSlug={product.slug}
              location="product-card"
              label={<><MessageCircle className="h-4 w-4" aria-hidden="true" />Enquire</>}
              ariaLabel={`Enquire about ${product.title} on WhatsApp`}
              className={buttonStyles({ variant: 'navy', size: 'sm', className: 'flex-1' })}
            />
          )}
        </div>
      </div>
    </article>
  );
}
