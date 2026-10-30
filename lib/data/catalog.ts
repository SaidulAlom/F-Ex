import { unstable_cache } from 'next/cache';
import { Types } from 'mongoose';
import { ProductModel } from '@/models/Product';
import { getDemoStore, demoId } from '@/lib/demo-store';
import { CACHE_TAGS } from '@/lib/cache';
import { escapeRegExp } from '@/lib/sanitize';
import { withReadFallback } from '@/lib/data/common';
import { serializeDocument, serializeDocuments } from '@/lib/serialization';
import type { Product, ProductQuery, ProductResult } from '@/lib/types';
import type { ProductInput } from '@/lib/validators';

function branchMatches(productBranch: Product['branch'], filter?: ProductQuery['branch']): boolean {
  if (!filter) return true;
  return productBranch === 'both' || productBranch === filter;
}

function matchesQuery(product: Product, query: ProductQuery): boolean {
  const q = query.q?.trim().toLowerCase();
  if (q) {
    const haystack = `${product.title} ${product.brand} ${product.shortDescription} ${product.category}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  if (query.category && product.category !== query.category) return false;
  if (query.categories?.length && !query.categories.includes(product.category)) return false;
  if (query.brand && product.brand.toLowerCase() !== query.brand.toLowerCase()) return false;
  if (query.condition && product.condition !== query.condition) return false;
  if (query.status && product.status !== query.status) return false;
  if (query.featured !== undefined && product.featured !== query.featured) return false;
  if (!branchMatches(product.branch, query.branch)) return false;
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    if (product.callForPrice || product.price == null) return false;
    if (query.minPrice !== undefined && product.price < query.minPrice) return false;
    if (query.maxPrice !== undefined && product.price > query.maxPrice) return false;
  }
  return true;
}

function sortProducts(items: Product[], sort: ProductQuery['sort']): Product[] {
  const copy = [...items];
  switch (sort) {
    case 'price-asc':
      return copy.sort(
        (a, b) => (a.callForPrice ? 1 : b.callForPrice ? -1 : (a.price ?? 0) - (b.price ?? 0)),
      );
    case 'price-desc':
      return copy.sort(
        (a, b) => (a.callForPrice ? 1 : b.callForPrice ? -1 : (b.price ?? 0) - (a.price ?? 0)),
      );
    case 'newest':
      return copy.sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
      );
    case 'featured':
    default:
      return copy.sort((a, b) => {
        if (Number(b.featured) !== Number(a.featured)) return Number(b.featured) - Number(a.featured);
        if (a.status !== b.status) return a.status === 'Available' ? -1 : b.status === 'Available' ? 1 : 0;
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
  }
}

function mongoFilter(query: ProductQuery): Record<string, unknown> {
  const filter: Record<string, unknown> = {};
  if (query.q) {
    const expression = new RegExp(escapeRegExp(query.q), 'i');
    filter.$or = [{ title: expression }, { brand: expression }, { shortDescription: expression }];
  }
  if (query.category) filter.category = query.category;
  if (query.categories?.length) filter.category = { $in: query.categories };
  if (query.brand) filter.brand = new RegExp(`^${escapeRegExp(query.brand)}$`, 'i');
  if (query.condition) filter.condition = query.condition;
  if (query.status) filter.status = query.status;
  if (query.featured !== undefined) filter.featured = query.featured;
  if (query.branch) filter.branch = { $in: [query.branch, 'both'] };
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    filter.callForPrice = false;
    filter.price = {
      ...(query.minPrice !== undefined ? { $gte: query.minPrice } : {}),
      ...(query.maxPrice !== undefined ? { $lte: query.maxPrice } : {}),
    };
  }
  return filter;
}

function mongoSort(query: ProductQuery): Record<string, 1 | -1> {
  switch (query.sort) {
    case 'price-asc':
      return { price: 1, createdAt: -1 };
    case 'price-desc':
      return { price: -1, createdAt: -1 };
    case 'newest':
      return { createdAt: -1 };
    default:
      return { featured: -1, status: 1, createdAt: -1 };
  }
}

async function readProducts(query: ProductQuery): Promise<ProductResult> {
  const limit = query.limit ?? 9;
  const requestedPage = query.page ?? 1;

  return withReadFallback<ProductResult>(
    async () => {
      const filter = mongoFilter(query);
      const total = await ProductModel.countDocuments(filter);
      const pages = Math.max(1, Math.ceil(total / limit));
      const page = Math.min(requestedPage, pages);
      const documents = await ProductModel.find(filter)
        .sort(mongoSort(query))
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
      return {
        items: serializeDocuments<Product>(documents),
        total,
        page,
        pages,
        limit,
      };
    },
    () => {
      const store = getDemoStore();
      const matched = sortProducts(
        store.products.filter((product) => matchesQuery(product, query)),
        query.sort,
      );
      const total = matched.length;
      const pages = Math.max(1, Math.ceil(total / limit));
      const page = Math.min(requestedPage, pages);
      return {
        items: matched.slice((page - 1) * limit, page * limit),
        total,
        page,
        pages,
        limit,
      };
    },
  );
}

const cachedProducts = unstable_cache(readProducts, ['catalog-products-v1'], {
  tags: [CACHE_TAGS.products],
  revalidate: 300,
});

export function getProducts(query: ProductQuery = {}): Promise<ProductResult> {
  return cachedProducts(query);
}

export function getProductsUncached(query: ProductQuery = {}): Promise<ProductResult> {
  return readProducts(query);
}

async function readProductBySlug(slug: string): Promise<Product | null> {
  return withReadFallback<Product | null>(
    async () => {
      const document = await ProductModel.findOne({ slug }).lean();
      return document ? serializeDocument<Product>(document) : null;
    },
    () => getDemoStore().products.find((product) => product.slug === slug) || null,
  );
}

const cachedProductBySlug = unstable_cache(readProductBySlug, ['catalog-product-slug-v1'], {
  tags: [CACHE_TAGS.products],
  revalidate: 300,
});

export function getProductBySlug(slug: string): Promise<Product | null> {
  return cachedProductBySlug(slug);
}

export async function getProductById(id: string): Promise<Product | null> {
  return withReadFallback<Product | null>(
    async () => {
      if (!Types.ObjectId.isValid(id)) return null;
      const document = await ProductModel.findById(id).lean();
      return document ? serializeDocument<Product>(document) : null;
    },
    () => getDemoStore().products.find((product) => product.id === id) || null,
  );
}

export async function getAllProductSlugs(): Promise<string[]> {
  return withReadFallback<string[]>(
    async () => {
      const documents = (await ProductModel.find({}, { slug: 1 }).lean()) as unknown as {
        slug: string;
      }[];
      return documents.map((document) => document.slug);
    },
    () => getDemoStore().products.map((product) => product.slug),
  );
}

export async function getProductFacets(): Promise<{ brands: string[] }> {
  return withReadFallback<{ brands: string[] }>(
    async () => {
      const brands = await ProductModel.distinct('brand');
      return { brands: (brands as string[]).filter(Boolean).sort((a, b) => a.localeCompare(b)) };
    },
    () => ({
      brands: [...new Set(getDemoStore().products.map((product) => product.brand))].sort(),
    }),
  );
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  const result = await getProducts({ featured: true, limit, page: 1, sort: 'featured' });
  if (result.items.length >= limit) return result.items;
  const fill = await getProducts({ limit, page: 1, sort: 'featured' });
  return [...result.items, ...fill.items.filter((p) => !result.items.some((x) => x.id === p.id))].slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const result = await getProducts({ category: product.category, limit: limit + 1, page: 1 });
  return result.items.filter((item) => item.id !== product.id).slice(0, limit);
}

async function uniqueSlug(slug: string, ignoreId?: string): Promise<string> {
  let candidate = slug;
  let counter = 2;
  while (true) {
    const existing = await readProductBySlug(candidate);
    if (!existing || existing.id === ignoreId) return candidate;
    candidate = `${slug}-${counter++}`;
  }
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const { requireWriteMode } = await import('@/lib/data/common');
  const mode = await requireWriteMode();
  const slug = await uniqueSlug(input.slug);
  const now = new Date().toISOString();

  if (mode === 'db') {
    const document = await ProductModel.create({ ...input, slug });
    return serializeDocument<Product>(document);
  }

  const product: Product = {
    ...input,
    slug,
    id: demoId('product'),
    createdAt: now,
    updatedAt: now,
  };
  getDemoStore().products.unshift(product);
  return product;
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product | null> {
  const { requireWriteMode } = await import('@/lib/data/common');
  const mode = await requireWriteMode();
  const slug = await uniqueSlug(input.slug, id);
  const now = new Date().toISOString();

  if (mode === 'db') {
    if (!Types.ObjectId.isValid(id)) return null;
    const document = await ProductModel.findByIdAndUpdate(
      id,
      { ...input, slug },
      { new: true, runValidators: true },
    ).lean();
    return document ? serializeDocument<Product>(document) : null;
  }

  const store = getDemoStore();
  const index = store.products.findIndex((product) => product.id === id);
  if (index < 0) return null;
  const product: Product = {
    ...store.products[index],
    ...input,
    slug,
    updatedAt: now,
  };
  store.products[index] = product;
  return product;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { requireWriteMode } = await import('@/lib/data/common');
  const mode = await requireWriteMode();
  if (mode === 'db') {
    if (!Types.ObjectId.isValid(id)) return false;
    const result = await ProductModel.findByIdAndDelete(id);
    return Boolean(result);
  }
  const store = getDemoStore();
  const before = store.products.length;
  store.products = store.products.filter((product) => product.id !== id);
  return store.products.length < before;
}

export async function setProductStatus(
  id: string,
  status: Product['status'],
): Promise<Product | null> {
  const { requireWriteMode } = await import('@/lib/data/common');
  const mode = await requireWriteMode();
  if (mode === 'db') {
    if (!Types.ObjectId.isValid(id)) return null;
    const document = await ProductModel.findByIdAndUpdate(id, { status }, { new: true }).lean();
    return document ? serializeDocument<Product>(document) : null;
  }
  const product = getDemoStore().products.find((item) => item.id === id);
  if (!product) return null;
  product.status = status;
  product.updatedAt = new Date().toISOString();
  return product;
}

export async function setProductFeatured(id: string, featured: boolean): Promise<Product | null> {
  const { requireWriteMode } = await import('@/lib/data/common');
  const mode = await requireWriteMode();
  if (mode === 'db') {
    if (!Types.ObjectId.isValid(id)) return null;
    const document = await ProductModel.findByIdAndUpdate(id, { featured }, { new: true }).lean();
    return document ? serializeDocument<Product>(document) : null;
  }
  const product = getDemoStore().products.find((item) => item.id === id);
  if (!product) return null;
  product.featured = featured;
  product.updatedAt = new Date().toISOString();
  return product;
}
