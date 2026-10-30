import {
  sampleBanners,
  sampleBranches,
  sampleLeads,
  sampleProducts,
  sampleTestimonials,
} from '@/lib/seed-data';
import type { Banner, Branch, Lead, Product, Testimonial } from '@/lib/types';

export interface DemoStore {
  products: Product[];
  banners: Banner[];
  testimonials: Testimonial[];
  leads: Lead[];
  branches: Branch[];
}

declare global {
  var __fexDemoStore: DemoStore | undefined;
}

function initialStore(): DemoStore {
  return JSON.parse(
    JSON.stringify({
      products: sampleProducts,
      banners: sampleBanners,
      testimonials: sampleTestimonials,
      leads: sampleLeads,
      branches: sampleBranches(),
    }),
  ) as DemoStore;
}

/** Per-process fallback only; use MongoDB for durable data on Vercel. */
export function getDemoStore(): DemoStore {
  if (!global.__fexDemoStore) global.__fexDemoStore = initialStore();
  return global.__fexDemoStore;
}

export function demoId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
