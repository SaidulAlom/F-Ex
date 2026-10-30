import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F8FA',
    theme_color: '#0B1220',
    icons: [
      {
        src: '/images/fex-logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
