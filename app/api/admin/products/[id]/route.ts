import { HttpError, withAdmin, parseJsonBody, requireBranchAccess } from '@/lib/admin-api';
import { deleteProduct, getProductById, updateProduct } from '@/lib/data/catalog';
import { CACHE_TAGS, productPaths, revalidatePublicContent } from '@/lib/cache';
import { productSchema } from '@/lib/validators';
import { apiError, apiOk, zodDetails } from '@/lib/api-response';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: Context) {
  const { id } = await context.params;
  return withAdmin(async (user) => {
    const existing = await getProductById(id);
    if (!existing) throw new HttpError('Product not found', 404);
    requireBranchAccess(user, existing.branch);
    const parsed = productSchema.safeParse(await parseJsonBody(request));
    if (!parsed.success) return apiError('Please check the product fields', 400, zodDetails(parsed.error));
    requireBranchAccess(user, parsed.data.branch);
    const product = await updateProduct(id, parsed.data);
    if (!product) throw new HttpError('Product not found', 404);
    revalidatePublicContent(
      [CACHE_TAGS.products],
      [...productPaths(existing), ...productPaths(product)],
    );
    return apiOk({ product });
  });
}

export async function DELETE(_request: Request, context: Context) {
  const { id } = await context.params;
  return withAdmin(async (user) => {
    const existing = await getProductById(id);
    if (!existing) throw new HttpError('Product not found', 404);
    requireBranchAccess(user, existing.branch);
    const deleted = await deleteProduct(id);
    if (!deleted) throw new HttpError('Product could not be deleted', 400);
    revalidatePublicContent([CACHE_TAGS.products], productPaths(existing));
    return apiOk({ deleted: true });
  });
}
