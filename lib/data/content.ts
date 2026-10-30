import { unstable_cache } from 'next/cache';
import { Types } from 'mongoose';
import { BannerModel } from '@/models/Banner';
import { BranchModel } from '@/models/Branch';
import { TestimonialModel } from '@/models/Testimonial';
import { siteConfig } from '@/lib/config';
import { getDemoStore, demoId } from '@/lib/demo-store';
import { CACHE_TAGS } from '@/lib/cache';
import { withReadFallback } from '@/lib/data/common';
import { serializeDocument, serializeDocuments } from '@/lib/serialization';
import type { Banner, Branch, Testimonial } from '@/lib/types';
import type { BranchInput, BannerInput, TestimonialInput } from '@/lib/validators';

function isBannerLive(banner: Banner, now: Date): boolean {
  const start = new Date(banner.startDate).getTime();
  const end = new Date(banner.endDate).getTime();
  return banner.active && start <= now.getTime() && end >= now.getTime();
}

function sortBanners(items: Banner[]): Banner[] {
  return [...items].sort((a, b) => a.position - b.position);
}

function splitAddress(address: string): string[] {
  return address
    .split(',')
    .map((line) => line.trim())
    .filter(Boolean);
}

async function readBranches(): Promise<Branch[]> {
  return withReadFallback<Branch[]>(
    async () => {
      const overrides = serializeDocuments<Partial<Branch> & { slug: Branch['slug'] }>(
        await BranchModel.find({}).lean(),
      );
      return siteConfig.branches.map((base) => {
        const override = overrides.find((item) => item.slug === base.slug);
        return {
          ...JSON.parse(JSON.stringify(base)),
          phone: override?.phone || base.phone,
          address: override?.address || base.address,
          addressLines: override?.address ? splitAddress(override.address) : [...base.addressLines],
          hours: override?.hours?.length ? override.hours : JSON.parse(JSON.stringify(base.hours)),
          updatedAt: override?.updatedAt,
        } as Branch;
      });
    },
    () => getDemoStore().branches,
  );
}

const cachedBranches = unstable_cache(readBranches, ['branches-v1'], {
  tags: [CACHE_TAGS.branches],
  revalidate: 600,
});

export function getBranches(): Promise<Branch[]> {
  return cachedBranches();
}

export function getBranchesUncached(): Promise<Branch[]> {
  return readBranches();
}

export async function getBranchBySlug(slug: string): Promise<Branch | undefined> {
  return (await getBranches()).find((branch) => branch.slug === slug);
}

async function readBanners(): Promise<Banner[]> {
  return withReadFallback<Banner[]>(
    async () => sortBanners(serializeDocuments<Banner>(await BannerModel.find({}).lean())),
    () => sortBanners(getDemoStore().banners),
  );
}

const cachedBanners = unstable_cache(readBanners, ['banners-v1'], {
  tags: [CACHE_TAGS.banners],
  revalidate: 60,
});

export async function getActiveBanners(type?: Banner['type']): Promise<Banner[]> {
  const banners = await cachedBanners();
  const now = new Date();
  return banners.filter((banner) => isBannerLive(banner, now) && (!type || banner.type === type));
}

export function getAllBanners(): Promise<Banner[]> {
  return readBanners();
}

async function readTestimonials(): Promise<Testimonial[]> {
  return withReadFallback<Testimonial[]>(
    async () =>
      serializeDocuments<Testimonial>(
        await TestimonialModel.find({}).sort({ createdAt: -1 }).lean(),
      ),
    () => getDemoStore().testimonials,
  );
}

const cachedTestimonials = unstable_cache(readTestimonials, ['testimonials-v1'], {
  tags: [CACHE_TAGS.testimonials],
  revalidate: 300,
});

export async function getApprovedTestimonials(): Promise<Testimonial[]> {
  const items = await cachedTestimonials();
  return items.filter((item) => item.approved);
}

export function getAllTestimonials(): Promise<Testimonial[]> {
  return readTestimonials();
}

export async function createBanner(input: BannerInput): Promise<Banner> {
  const { requireWriteMode } = await import('@/lib/data/common');
  const mode = await requireWriteMode();
  if (mode === 'db') {
    const document = await BannerModel.create(input);
    return serializeDocument<Banner>(document);
  }
  const banner: Banner = {
    ...input,
    id: demoId('banner'),
    startDate: new Date(input.startDate).toISOString(),
    endDate: new Date(input.endDate).toISOString(),
  };
  getDemoStore().banners.unshift(banner);
  return banner;
}

export async function updateBanner(id: string, input: BannerInput): Promise<Banner | null> {
  const { requireWriteMode } = await import('@/lib/data/common');
  const mode = await requireWriteMode();
  const payload = {
    ...input,
    startDate: new Date(input.startDate),
    endDate: new Date(input.endDate),
  };
  if (mode === 'db') {
    if (!Types.ObjectId.isValid(id)) return null;
    const document = await BannerModel.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).lean();
    return document ? serializeDocument<Banner>(document) : null;
  }
  const banner = getDemoStore().banners.find((item) => item.id === id);
  if (!banner) return null;
  Object.assign(banner, payload, {
    startDate: payload.startDate.toISOString(),
    endDate: payload.endDate.toISOString(),
  });
  return banner;
}

export async function deleteBanner(id: string): Promise<boolean> {
  const { requireWriteMode } = await import('@/lib/data/common');
  const mode = await requireWriteMode();
  if (mode === 'db') {
    if (!Types.ObjectId.isValid(id)) return false;
    return Boolean(await BannerModel.findByIdAndDelete(id));
  }
  const store = getDemoStore();
  const before = store.banners.length;
  store.banners = store.banners.filter((item) => item.id !== id);
  return store.banners.length < before;
}

export async function createTestimonial(input: TestimonialInput): Promise<Testimonial> {
  const { requireWriteMode } = await import('@/lib/data/common');
  const mode = await requireWriteMode();
  const now = new Date().toISOString();
  if (mode === 'db') {
    const document = await TestimonialModel.create(input);
    return serializeDocument<Testimonial>(document);
  }
  const testimonial: Testimonial = { ...input, id: demoId('testimonial'), createdAt: now };
  getDemoStore().testimonials.unshift(testimonial);
  return testimonial;
}

export async function updateTestimonial(
  id: string,
  input: TestimonialInput,
): Promise<Testimonial | null> {
  const { requireWriteMode } = await import('@/lib/data/common');
  const mode = await requireWriteMode();
  if (mode === 'db') {
    if (!Types.ObjectId.isValid(id)) return null;
    const document = await TestimonialModel.findByIdAndUpdate(id, input, {
      new: true,
      runValidators: true,
    }).lean();
    return document ? serializeDocument<Testimonial>(document) : null;
  }
  const testimonial = getDemoStore().testimonials.find((item) => item.id === id);
  if (!testimonial) return null;
  Object.assign(testimonial, input, { updatedAt: new Date().toISOString() });
  return testimonial;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const { requireWriteMode } = await import('@/lib/data/common');
  const mode = await requireWriteMode();
  if (mode === 'db') {
    if (!Types.ObjectId.isValid(id)) return false;
    return Boolean(await TestimonialModel.findByIdAndDelete(id));
  }
  const store = getDemoStore();
  const before = store.testimonials.length;
  store.testimonials = store.testimonials.filter((item) => item.id !== id);
  return store.testimonials.length < before;
}

export async function updateBranch(input: BranchInput): Promise<Branch | null> {
  const { requireWriteMode } = await import('@/lib/data/common');
  const mode = await requireWriteMode();
  if (mode === 'db') {
    await BranchModel.findOneAndUpdate(
      { slug: input.slug },
      { $set: { phone: input.phone, address: input.address, hours: input.hours } },
      { upsert: true, new: true, runValidators: true },
    ).lean();
  } else {
    const branch = getDemoStore().branches.find((item) => item.slug === input.slug);
    if (!branch) return null;
    branch.phone = input.phone;
    branch.address = input.address;
    branch.addressLines = splitAddress(input.address);
    branch.hours = input.hours;
    branch.updatedAt = new Date().toISOString();
  }
  return (await readBranches()).find((branch) => branch.slug === input.slug) || null;
}
