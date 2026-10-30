import { HttpError, requireOwner, withAdmin, parseJsonBody } from '@/lib/admin-api';
import { deleteBanner, getAllBanners, updateBanner } from '@/lib/data/content';
import { CACHE_TAGS, revalidatePublicContent } from '@/lib/cache';
import { bannerSchema } from '@/lib/validators';
import { apiError, apiOk, zodDetails } from '@/lib/api-response';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: Context) {
  const { id } = await context.params;
  return withAdmin(async (user) => {
    requireOwner(user);
    const parsed = bannerSchema.safeParse(await parseJsonBody(request));
    if (!parsed.success) return apiError('Please check the banner fields', 400, zodDetails(parsed.error));
    const banner = await updateBanner(id, parsed.data);
    if (!banner) throw new HttpError('Banner not found', 404);
    revalidatePublicContent([CACHE_TAGS.banners], ['/', '/shop']);
    return apiOk({ banner });
  });
}

export async function DELETE(_request: Request, context: Context) {
  const { id } = await context.params;
  return withAdmin(async (user) => {
    requireOwner(user);
    const exists = (await getAllBanners()).some((banner) => banner.id === id);
    if (!exists) throw new HttpError('Banner not found', 404);
    await deleteBanner(id);
    revalidatePublicContent([CACHE_TAGS.banners], ['/', '/shop']);
    return apiOk({ deleted: true });
  });
}
