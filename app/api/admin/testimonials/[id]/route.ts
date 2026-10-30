import { HttpError, requireOwner, withAdmin, parseJsonBody } from '@/lib/admin-api';
import { deleteTestimonial, getAllTestimonials, updateTestimonial } from '@/lib/data/content';
import { CACHE_TAGS, revalidatePublicContent } from '@/lib/cache';
import { testimonialSchema } from '@/lib/validators';
import { apiError, apiOk, zodDetails } from '@/lib/api-response';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: Context) {
  const { id } = await context.params;
  return withAdmin(async (user) => {
    requireOwner(user);
    const parsed = testimonialSchema.safeParse(await parseJsonBody(request));
    if (!parsed.success) return apiError('Please check the testimonial fields', 400, zodDetails(parsed.error));
    const testimonial = await updateTestimonial(id, parsed.data);
    if (!testimonial) throw new HttpError('Testimonial not found', 404);
    revalidatePublicContent([CACHE_TAGS.testimonials], ['/']);
    return apiOk({ testimonial });
  });
}

export async function DELETE(_request: Request, context: Context) {
  const { id } = await context.params;
  return withAdmin(async (user) => {
    requireOwner(user);
    const exists = (await getAllTestimonials()).some((item) => item.id === id);
    if (!exists) throw new HttpError('Testimonial not found', 404);
    await deleteTestimonial(id);
    revalidatePublicContent([CACHE_TAGS.testimonials], ['/']);
    return apiOk({ deleted: true });
  });
}
