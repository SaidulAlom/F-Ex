import { requireOwner, withAdmin, parseJsonBody } from '@/lib/admin-api';
import { createBanner, getAllBanners } from '@/lib/data/content';
import { CACHE_TAGS, revalidatePublicContent } from '@/lib/cache';
import { bannerSchema } from '@/lib/validators';
import { apiError, apiOk, zodDetails } from '@/lib/api-response';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return withAdmin(async (user) => {
    requireOwner(user);
    return apiOk({ banners: await getAllBanners() });
  });
}

export async function POST(request: Request) {
  return withAdmin(async (user) => {
    requireOwner(user);
    const parsed = bannerSchema.safeParse(await parseJsonBody(request));
    if (!parsed.success) return apiError('Please check the banner fields', 400, zodDetails(parsed.error));
    const banner = await createBanner(parsed.data);
    revalidatePublicContent([CACHE_TAGS.banners], ['/', '/shop']);
    return apiOk({ banner }, 201);
  });
}
