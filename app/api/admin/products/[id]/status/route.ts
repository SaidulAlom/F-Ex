import { HttpError, withAdmin, parseJsonBody, requireBranchAccess } from '@/lib/admin-api';
import { getProductById, setProductStatus } from '@/lib/data/catalog';
import { CACHE_TAGS, productPaths, revalidatePublicContent } from '@/lib/cache';
import { productStatusSchema } from '@/lib/validators';
import { apiError, apiOk, zodDetails } from '@/lib/api-response';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return withAdmin(async (user) => {
    const existing = await getProductById(id);
    if (!existing) throw new HttpError('Product not found', 404);
    requireBranchAccess(user, existing.branch);
    const parsed = productStatusSchema.safeParse(await parseJsonBody(request));
    if (!parsed.success) return apiError('Invalid status', 400, zodDetails(parsed.error));
    const product = await setProductStatus(id, parsed.data.status);
    revalidatePublicContent([CACHE_TAGS.products], productPaths(existing));
    return apiOk({ product });
  });
}
