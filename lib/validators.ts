import { z } from 'zod';
import { REPAIR_ISSUE_TYPES } from '@/lib/constants';
import {
  safeCloudinaryUrl,
  safeHttpUrl,
  sanitizeMultiline,
  sanitizeText,
} from '@/lib/sanitize';
import { slugify } from '@/lib/utils';
import type { Lead } from '@/lib/types';

const cleanText = (min: number, max: number, field = 'This field') =>
  z
    .string()
    .trim()
    .min(min, `${field} must be at least ${min} characters`)
    .max(max, `${field} must be at most ${max} characters`)
    .transform(sanitizeText)
    .refine((value) => value.length >= min, `${field} is too short`);

const cleanMultiline = (min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min, `Please write at least ${min} characters`)
    .max(max, `Please keep this under ${max} characters`)
    .transform(sanitizeMultiline)
    .refine((value) => value.length >= min, 'Please add a little more detail');

const phoneSchema = z
  .string()
  .trim()
  .min(10, 'Enter a valid phone number')
  .max(22, 'Enter a valid phone number')
  .transform((value) => sanitizeText(value).replace(/[^\d+\-\s]/g, '').trim())
  .refine((value) => value.replace(/\D/g, '').length >= 10, 'Enter a valid phone number');

const optionalEmail = z
  .union([z.literal(''), z.string().trim().email('Enter a valid email').max(160)])
  .optional()
  .transform((value) => (value ? sanitizeText(value).toLowerCase() : undefined));

const branchSchema = z.enum(['lokhra', 'basistha', 'both']);
const honeypotSchema = z.string().max(0, 'Invalid submission').optional().default('');
const optionalSafeUrl = z
  .string()
  .trim()
  .max(700)
  .optional()
  .refine((value) => !value || Boolean(safeCloudinaryUrl(value)), 'Uploaded image URL is invalid')
  .transform((value) => (value ? safeCloudinaryUrl(value) || undefined : undefined));

const safeCtaSchema = z
  .string()
  .trim()
  .max(400)
  .refine(
    (value) => value.startsWith('/') || Boolean(safeHttpUrl(value)),
    'Use an internal path beginning with / or a complete https URL',
  )
  .transform(sanitizeText);

const imageSchema = z.object({
  url: z
    .string()
    .trim()
    .max(700)
    .refine((value) => Boolean(safeCloudinaryUrl(value)), 'Use a Cloudinary or local image URL'),
  publicId: z.string().trim().max(300).optional().transform((v) => v || undefined),
  alt: cleanText(3, 180, 'Image alt text'),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email').max(160).transform(sanitizeText),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const searchSchema = z.object({
  q: z
    .string()
    .trim()
    .min(1, 'Enter a search term')
    .max(60, 'Search is too long')
    .transform(sanitizeText),
});

export const productSchema = z
  .object({
    title: cleanText(3, 160, 'Title'),
    slug: cleanText(3, 100, 'Slug').transform(slugify),
    brand: cleanText(2, 60, 'Brand'),
    category: z.enum(['new-phone', 'second-hand', 'accessory', 'gadget', 'landline']),
    condition: z.enum(['New', 'Pre-owned', 'Refurbished', 'Accessory']),
    price: z.number().min(0, 'Price cannot be negative').max(10_000_000),
    callForPrice: z.boolean(),
    shortDescription: cleanText(10, 260, 'Short description'),
    description: cleanMultiline(10, 4000),
    specs: z.object({
      ram: z.string().trim().max(80).transform(sanitizeText).optional(),
      storage: z.string().trim().max(80).transform(sanitizeText).optional(),
      color: z.string().trim().max(80).transform(sanitizeText).optional(),
      display: z.string().trim().max(120).transform(sanitizeText).optional(),
      processor: z.string().trim().max(120).transform(sanitizeText).optional(),
      camera: z.string().trim().max(120).transform(sanitizeText).optional(),
      connectivity: z.string().trim().max(120).transform(sanitizeText).optional(),
    }),
    images: z.array(imageSchema).min(1, 'Add at least one image').max(8),
    batteryHealth: z.string().trim().max(60).transform(sanitizeText).optional(),
    warranty: z.string().trim().max(120).transform(sanitizeText).optional(),
    grade: z
      .union([z.enum(['A', 'B', 'C']), z.literal('')])
      .optional()
      .transform((value) => value || undefined),
    status: z.enum(['Available', 'Reserved', 'Sold']),
    branch: z.enum(['lokhra', 'basistha', 'both']),
    featured: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.callForPrice && data.price <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['price'],
        message: 'Enter a price or enable Call for price',
      });
    }
  });
export type ProductInput = z.infer<typeof productSchema>;

export const productStatusSchema = z.object({
  status: z.enum(['Available', 'Reserved', 'Sold']),
});
export const featuredSchema = z.object({ featured: z.boolean() });

export const bannerSchema = z
  .object({
    title: cleanText(3, 160, 'Title'),
    subtitle: cleanText(5, 320, 'Subtitle'),
    badge: z.string().trim().max(80).transform(sanitizeText).optional(),
    ctaLabel: cleanText(2, 60, 'CTA label'),
    ctaHref: safeCtaSchema,
    image: z
      .string()
      .trim()
      .max(700)
      .refine((value) => Boolean(safeCloudinaryUrl(value)), 'Use a Cloudinary or local image'),
    imageAlt: cleanText(3, 180, 'Image alt text'),
    type: z.enum(['hero', 'offer']),
    active: z.boolean(),
    startDate: z.string().min(10, 'Choose a valid start date'),
    endDate: z.string().min(10, 'Choose a valid end date'),
    position: z.number().int().min(0).max(100),
    theme: z.enum(['navy', 'blue', 'orange']),
  })
  .refine((data) => new Date(data.endDate).getTime() > new Date(data.startDate).getTime(), {
    path: ['endDate'],
    message: 'End date must be after start date',
  });
export type BannerInput = z.infer<typeof bannerSchema>;

export const branchUpdateSchema = z.object({
  slug: z.enum(['lokhra', 'basistha']),
  phone: z.string().trim().max(40).transform(sanitizeText),
  address: cleanMultiline(10, 600),
  hours: z
    .array(
      z.object({
        label: cleanText(3, 80, 'Hours label'),
        days: z.array(z.number().int().min(0).max(6)).min(1),
        open: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use HH:MM'),
        close: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use HH:MM'),
      }),
    )
    .min(1),
});
export type BranchInput = z.infer<typeof branchUpdateSchema>;

export const testimonialSchema = z.object({
  name: cleanText(2, 120, 'Name'),
  location: cleanText(2, 120, 'Location'),
  quote: cleanMultiline(10, 700),
  rating: z.number().int().min(1).max(5),
  approved: z.boolean(),
});
export type TestimonialInput = z.infer<typeof testimonialSchema>;

export const leadStatusSchema = z.object({
  status: z.enum(['New', 'Contacted', 'Closed']),
});

export const uploadSignSchema = z.object({
  context: z.enum(['product', 'repair']),
});

const leadBase = {
  name: cleanText(2, 120, 'Name'),
  phone: phoneSchema,
  email: optionalEmail,
  branch: branchSchema.default('both'),
  companyWebsite: honeypotSchema,
  source: z.string().trim().max(120).transform(sanitizeText).optional(),
};

export const contactSchema = z.object({
  ...leadBase,
  type: z.literal('contact'),
  message: cleanMultiline(10, 3000),
});

export const enquirySchema = z.object({
  ...leadBase,
  type: z.literal('enquiry'),
  message: cleanMultiline(5, 3000),
  productTitle: cleanText(2, 180, 'Product title').optional(),
  productSlug: cleanText(2, 180, 'Product slug').optional(),
});

export const reservationSchema = z.object({
  ...leadBase,
  type: z.literal('reservation'),
  productTitle: cleanText(2, 180, 'Product title'),
  productSlug: cleanText(2, 180, 'Product slug'),
  pickupTime: cleanText(3, 80, 'Pickup time'),
  branch: z.enum(['lokhra', 'basistha']),
  message: cleanMultiline(5, 1000).optional(),
});

export const repairSchema = z.object({
  ...leadBase,
  type: z.literal('repair'),
  brand: cleanText(2, 80, 'Brand'),
  model: cleanText(2, 120, 'Model'),
  issueType: z.enum(REPAIR_ISSUE_TYPES),
  description: cleanMultiline(10, 3000),
  photoUrl: optionalSafeUrl,
  branch: z.enum(['lokhra', 'basistha']),
});

export const sellSchema = z.object({
  ...leadBase,
  type: z.literal('sell'),
  deviceDetails: cleanMultiline(5, 1200),
  expectedPrice: z.string().trim().max(80).transform(sanitizeText).optional(),
  branch: z.enum(['lokhra', 'basistha', 'both']),
});

export const leadInputSchema = z.discriminatedUnion('type', [
  contactSchema,
  enquirySchema,
  reservationSchema,
  repairSchema,
  sellSchema,
]);
export type LeadInput = z.infer<typeof leadInputSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ReservationInput = z.infer<typeof reservationSchema>;
export type RepairInput = z.infer<typeof repairSchema>;
export type SellInput = z.infer<typeof sellSchema>;

export function leadToRecord(input: LeadInput): Omit<
  Lead,
  'id' | 'status' | 'createdAt' | 'updatedAt'
> {
  const base = {
    name: input.name,
    phone: input.phone,
    email: input.email,
    branch: input.branch,
    source: input.source,
  };

  switch (input.type) {
    case 'contact':
      return {
        ...base,
        type: 'contact',
        message: input.message,
      };
    case 'enquiry':
      return {
        ...base,
        type: 'enquiry',
        message: input.message,
        productTitle: input.productTitle,
        productSlug: input.productSlug,
      };
    case 'reservation':
      return {
        ...base,
        type: 'reservation',
        productTitle: input.productTitle,
        productSlug: input.productSlug,
        pickupTime: input.pickupTime,
        message:
          input.message ||
          `Reservation request for ${input.productTitle}. Preferred pickup: ${input.pickupTime}.`,
      };
    case 'repair':
      return {
        ...base,
        type: 'repair',
        issueType: input.issueType,
        photoUrl: input.photoUrl,
        message: `Repair request — ${input.brand} ${input.model}. Issue: ${input.issueType}. ${input.description}`,
      };
    case 'sell':
      return {
        ...base,
        type: 'sell',
        message: `Sell/exchange interest — ${input.deviceDetails}. Expected price: ${input.expectedPrice || 'not specified'}.`,
      };
  }
}

export const adminLeadQuerySchema = z.object({
  q: z.string().trim().max(100).transform(sanitizeText).optional(),
  type: z.enum(['enquiry', 'repair', 'reservation', 'sell', 'contact']).optional(),
  status: z.enum(['New', 'Contacted', 'Closed']).optional(),
  branch: z.enum(['lokhra', 'basistha', 'both']).optional(),
  limit: z.coerce.number().int().min(1).max(500).default(100),
});
