import { HttpError, requireOwner, withAdmin, parseJsonBody } from '@/lib/admin-api';
import { getProductById, setProductFeatured } from '@/lib/data/catalog';
import { CACHE_TAGS, productPaths, revalidatePublicContent } from '@/lib/cache';
import { featuredSchema } from '@/lib/validators';
import { apiError, apiOk, zodDetails } from '@/lib/api-response';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return withAdmin(async (user) => {
    requireOwner(user);
    const existing = await getProductById(id);
    if (!existing) throw new HttpError('Product not found', 404);
    const parsed = featuredSchema.safeParse(await parseJsonBody(request));
    if (!parsed.success) return apiError('Invalid featured value', 400, zodDetails(parsed.error));
    const product = await setProductFeatured(id, parsed.data.featured);
    revalidatePublicContent([CACHE_TAGS.products], [...productPaths(existing), '/']);
    return apiOk({ product });
  });
}
