import { withAdmin, parseJsonBody, requireBranchAccess } from '@/lib/admin-api';
import { createProduct } from '@/lib/data/catalog';
import { CACHE_TAGS, productPaths, revalidatePublicContent } from '@/lib/cache';
import { productSchema } from '@/lib/validators';
import { apiError, apiOk, zodDetails } from '@/lib/api-response';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  return withAdmin(async (user) => {
    const parsed = productSchema.safeParse(await parseJsonBody(request));
    if (!parsed.success) return apiError('Please check the product fields', 400, zodDetails(parsed.error));
    requireBranchAccess(user, parsed.data.branch);
    const product = await createProduct(parsed.data);
    revalidatePublicContent([CACHE_TAGS.products], productPaths(product));
    return apiOk({ product }, 201);
  });
}
