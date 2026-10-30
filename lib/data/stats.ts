import { getProductsUncached } from '@/lib/data/catalog';
import { getAllBanners, getAllTestimonials } from '@/lib/data/content';
import { getLeads } from '@/lib/data/leads';
import type { DashboardStats, ProductBranch } from '@/lib/types';

export async function getDashboardStats(
  staffBranch?: ProductBranch,
): Promise<DashboardStats> {
  const [products, leads, banners, testimonials] = await Promise.all([
    getProductsUncached({ limit: 1000, page: 1, branch: staffBranch }),
    getLeads({ limit: 1000, staffBranch }),
    getAllBanners(),
    getAllTestimonials(),
  ]);
  return {
    products: products.total,
    available: products.items.filter((product) => product.status === 'Available').length,
    reserved: products.items.filter((product) => product.status === 'Reserved').length,
    sold: products.items.filter((product) => product.status === 'Sold').length,
    newLeads: leads.filter((lead) => lead.status === 'New').length,
    banners: banners.length,
    testimonials: testimonials.length,
  };
}
