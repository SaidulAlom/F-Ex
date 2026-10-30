import type { Branch, BranchSlug } from '@/lib/types';

/**
 * SINGLE SOURCE OF TRUTH for all branch data, WhatsApp numbers and social links.
 * Replace every value marked TODO before launch. Branch phone/address/hours can
 * then also be edited in /admin/branches; those edits override the values below
 * in MongoDB without changing this file.
 */

const lokhraAddress =
  'Beside Sarusajai Stadium, Near Paramount Grande, Lokhra Road, Lokhra, Guwahati-781034';
const basisthaAddress =
  'Brahmaputra Apartment, A G Office, Lakhi Mandir, Basistha, Guwahati-781029';

export const siteConfig = {
  name: 'F-Ex Store',
  legalName: 'F-Ex Store, Guwahati',
  shortName: 'F-Ex',
  tagline: 'Guwahati’s friendly phone store, open till 10 PM.',
  description:
    'Buy new and certified second-hand mobile phones, accessories, gadgets and landline phones in Guwahati. Repairs, EMI, same-day delivery and pickup from Lokhra and Basistha.',
  established: 2024,
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
  email: 'hello@fexstore.in', // TODO: replace with the confirmed business email.
  timeZone: 'Asia/Kolkata', // IST: used by all branch open/closed calculations.
  logo: '/images/fex-logo.svg',
  ogImage: '/opengraph-image',
  // TODO: replace all placeholder social URLs with verified F-Ex Store profiles.
  social: {
    instagram: 'https://www.instagram.com/',
    facebook: 'https://www.facebook.com/',
    googleReviews:
      'https://www.google.com/maps/search/?api=1&query=F-Ex%20Store%20Guwahati',
    youtube: 'https://www.youtube.com/',
  },
  // TODO: replace this with the dedicated WhatsApp Business number (digits only,
  // with country code, no plus sign). Until then the Lokhra sales number is used.
  whatsapp: {
    defaultNumber: '918511822537',
    defaultMessage:
      'Hello F-Ex Store, I found your website and would like some help choosing a phone.',
  },
  branches: [
    {
      id: 'branch-lokhra',
      slug: 'lokhra',
      name: 'F-Ex Store — Lokhra',
      legalName: 'F-Ex Store',
      addressLines: [
        'Beside Sarusajai Stadium',
        'Near Paramount Grande, Lokhra Road',
        'Lokhra, Guwahati-781034',
      ],
      address: lokhraAddress,
      pincode: '781034',
      phone: '+91-8511822537',
      // TODO: replace with the Lokhra WhatsApp Business number if different.
      whatsappNumber: '918511822537',
      hours: [
        {
          label: 'Monday – Sunday',
          days: [0, 1, 2, 3, 4, 5, 6],
          open: '10:30',
          close: '22:00',
        },
      ],
      mapEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(
        'Sarusajai Stadium Lokhra Road Guwahati 781034',
      )}&output=embed`, // TODO: replace with the exact Google Maps place embed URL.
      directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        lokhraAddress,
      )}`,
      photo: '/images/branches/lokhra-store.webp',
      highlights: [
        'Beside Sarusajai Stadium',
        'New & pre-owned phone inventory',
        'Screen and battery repair desk',
      ],
    },
    {
      id: 'branch-basistha',
      slug: 'basistha',
      name: 'F-Ex Guwahati Cell Store — Basistha',
      legalName: 'F Ex Guwahati Cell Store',
      addressLines: [
        'Brahmaputra Apartment, A G Office',
        'Lakhi Mandir, Basistha',
        'Guwahati-781029',
      ],
      address: basisthaAddress,
      pincode: '781029',
      // TODO: replace with the confirmed Basistha branch phone number.
      phone: 'ADD_BASISTHA_PHONE',
      // TODO: replace with the Basistha WhatsApp Business number.
      whatsappNumber: '918511822537',
      hours: [
        {
          label: 'Monday – Sunday',
          days: [0, 1, 2, 3, 4, 5, 6],
          open: '10:00',
          close: '22:00',
        },
      ],
      mapEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(
        'Lakhi Mandir Basistha Guwahati 781029',
      )}&output=embed`, // TODO: replace with the exact Google Maps place embed URL.
      directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        basisthaAddress,
      )}`,
      photo: '/images/branches/basistha-store.webp',
      highlights: [
        'Near Lakhi Mandir',
        'Accessories and gadget counter',
        'Quick diagnostic and pickup',
      ],
    },
  ] satisfies Branch[],
} as const;

export const branchSlugs: BranchSlug[] = siteConfig.branches.map((branch) => branch.slug);

export function getBranchConfig(slug: BranchSlug): Branch {
  const branch = siteConfig.branches.find((item) => item.slug === slug);
  if (!branch) throw new Error(`Unknown branch: ${slug}`);
  return JSON.parse(JSON.stringify(branch)) as Branch;
}

export function getPrimaryBranch(): Branch {
  return getBranchConfig('lokhra');
}
