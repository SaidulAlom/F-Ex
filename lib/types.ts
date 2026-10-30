export type BranchSlug = 'lokhra' | 'basistha';
export type ProductBranch = BranchSlug | 'both';
export type ProductCategory =
  | 'new-phone'
  | 'second-hand'
  | 'accessory'
  | 'gadget'
  | 'landline';
export type ProductCondition = 'New' | 'Pre-owned' | 'Refurbished' | 'Accessory';
export type ConditionGrade = 'A' | 'B' | 'C';
export type ProductStatus = 'Available' | 'Reserved' | 'Sold';
export type AdminRole = 'Owner' | 'BranchStaff';
export type LeadType = 'enquiry' | 'repair' | 'reservation' | 'sell' | 'contact';
export type LeadStatus = 'New' | 'Contacted' | 'Closed';

export interface ProductImage {
  url: string;
  publicId?: string;
  alt: string;
}

export interface ProductSpecs {
  ram?: string;
  storage?: string;
  color?: string;
  display?: string;
  processor?: string;
  camera?: string;
  connectivity?: string;
}

export interface BranchHour {
  label: string;
  days: number[];
  open: string;
  close: string;
}

export interface Branch {
  id?: string;
  slug: BranchSlug;
  name: string;
  legalName: string;
  addressLines: string[];
  address: string;
  pincode: string;
  phone: string;
  whatsappNumber: string;
  hours: BranchHour[];
  mapEmbedUrl: string;
  directionsUrl: string;
  photo: string;
  highlights: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  brand: string;
  category: ProductCategory;
  condition: ProductCondition;
  price: number | null;
  callForPrice: boolean;
  shortDescription: string;
  description: string;
  specs: ProductSpecs;
  images: ProductImage[];
  batteryHealth?: string;
  warranty?: string;
  grade?: ConditionGrade;
  status: ProductStatus;
  branch: ProductBranch;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
  type: 'hero' | 'offer';
  active: boolean;
  startDate: string;
  endDate: string;
  position: number;
  theme: 'navy' | 'blue' | 'orange';
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
  approved: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Lead {
  id: string;
  type: LeadType;
  name: string;
  phone: string;
  email?: string;
  message: string;
  branch: ProductBranch;
  status: LeadStatus;
  productTitle?: string;
  productSlug?: string;
  issueType?: string;
  photoUrl?: string;
  pickupTime?: string;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  branch: ProductBranch;
  passwordHash?: string;
}

export interface ProductQuery {
  q?: string;
  category?: ProductCategory;
  categories?: ProductCategory[];
  brand?: string;
  condition?: ProductCondition;
  status?: ProductStatus;
  minPrice?: number;
  maxPrice?: number;
  branch?: ProductBranch;
  featured?: boolean;
  sort?: 'featured' | 'newest' | 'price-asc' | 'price-desc';
  page?: number;
  limit?: number;
}

export interface ProductResult {
  items: Product[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface DashboardStats {
  products: number;
  available: number;
  reserved: number;
  sold: number;
  newLeads: number;
  banners: number;
  testimonials: number;
}
