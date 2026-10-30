import { siteConfig } from '@/lib/config';
import { absoluteUrl } from '@/lib/utils';
import { JsonLd } from '@/components/seo/JsonLd';
import type { Product } from '@/lib/types';

export function ProductJsonLd({ product }: { product: Product }) {
  const schemaAvailability =
    product.status === 'Available'
      ? 'https://schema.org/InStock'
      : product.status === 'Reserved'
        ? 'https://schema.org/PreOrder'
        : 'https://schema.org/OutOfStock';

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.shortDescription,
    image: product.images.map((image) =>
      image.url.startsWith('/') ? absoluteUrl(image.url) : image.url,
    ),
    brand: { '@type': 'Brand', name: product.brand },
    category: product.category,
    sku: product.slug,
    url: absoluteUrl(`/product/${product.slug}`),
    itemCondition:
      product.condition === 'New'
        ? 'https://schema.org/NewCondition'
        : 'https://schema.org/UsedCondition',
    additionalProperty: [
      product.grade ? { '@type': 'PropertyValue', name: 'Condition grade', value: product.grade } : null,
      product.batteryHealth
        ? { '@type': 'PropertyValue', name: 'Battery health', value: product.batteryHealth }
        : null,
      product.warranty
        ? { '@type': 'PropertyValue', name: 'Warranty', value: product.warranty }
        : null,
    ].filter(Boolean),
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(`/product/${product.slug}`),
      priceCurrency: 'INR',
      price: product.callForPrice || product.price == null ? undefined : product.price,
      availability: schemaAvailability,
      seller: { '@type': 'LocalBusiness', name: siteConfig.name },
      eligibleRegion: { '@type': 'AdministrativeArea', name: 'Guwahati, Assam' },
      priceSpecification:
        product.callForPrice || product.price == null
          ? { '@type': 'PriceSpecification', valueAddedTaxIncluded: true }
          : undefined,
    },
  };

  return <JsonLd data={data} />;
}
