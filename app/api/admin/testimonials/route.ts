import { requireOwner, withAdmin, parseJsonBody } from '@/lib/admin-api';
import { createTestimonial, getAllTestimonials } from '@/lib/data/content';
import { CACHE_TAGS, revalidatePublicContent } from '@/lib/cache';
import { testimonialSchema } from '@/lib/validators';
import { apiError, apiOk, zodDetails } from '@/lib/api-response';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return withAdmin(async (user) => {
    requireOwner(user);
    return apiOk({ testimonials: await getAllTestimonials() });
  });
}

export async function POST(request: Request) {
  return withAdmin(async (user) => {
    requireOwner(user);
    const parsed = testimonialSchema.safeParse(await parseJsonBody(request));
    if (!parsed.success) return apiError('Please check the testimonial fields', 400, zodDetails(parsed.error));
    const testimonial = await createTestimonial(parsed.data);
    revalidatePublicContent([CACHE_TAGS.testimonials], ['/']);
    return apiOk({ testimonial }, 201);
  });
}
