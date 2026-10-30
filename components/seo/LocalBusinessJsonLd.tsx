import { siteConfig } from '@/lib/config';
import { absoluteUrl, isRealPhone } from '@/lib/utils';
import { JsonLd } from '@/components/seo/JsonLd';
import type { Branch } from '@/lib/types';

const DAY_CODES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function LocalBusinessJsonLd({ branches }: { branches: Branch[] }) {
  const data = branches.map((branch) => ({
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Store', 'MobilePhoneStore'],
    '@id': `${siteConfig.url}/branches/${branch.slug}#business`,
    name: branch.legalName || branch.name,
    alternateName: branch.name,
    description: `${siteConfig.name} — new and second-hand mobile phones, accessories, gadgets and hardware repairs in Guwahati.`,
    url: absoluteUrl(`/branches/${branch.slug}`),
    image: absoluteUrl(branch.photo),
    telephone: isRealPhone(branch.phone) ? branch.phone : undefined,
    priceRange: '₹₹',
    foundingDate: String(siteConfig.established),
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Paytm, PhonePe, Visa, MasterCard, RuPay, EMI',
    areaServed: {
      '@type': 'City',
      name: 'Guwahati',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: branch.addressLines.join(', '),
      addressLocality: 'Guwahati',
      addressRegion: 'Assam',
      postalCode: branch.pincode,
      addressCountry: 'IN',
    },
    openingHoursSpecification: branch.hours.map((slot) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: slot.days.map((day) => `https://schema.org/${DAY_CODES[day]}`),
      opens: slot.open,
      closes: slot.close,
    })),
    hasMap: branch.directionsUrl,
    sameAs: Object.values(siteConfig.social),
  }));

  return <JsonLd data={data} />;
}
