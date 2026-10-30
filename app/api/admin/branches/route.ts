import { requireOwner, withAdmin, parseJsonBody } from '@/lib/admin-api';
import { getBranchesUncached, updateBranch } from '@/lib/data/content';
import { CACHE_TAGS, branchPaths, revalidatePublicContent } from '@/lib/cache';
import { branchUpdateSchema } from '@/lib/validators';
import { apiError, apiOk, zodDetails } from '@/lib/api-response';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return withAdmin(async (user) => {
    requireOwner(user);
    return apiOk({ branches: await getBranchesUncached() });
  });
}

export async function PUT(request: Request) {
  return withAdmin(async (user) => {
    requireOwner(user);
    const parsed = branchUpdateSchema.safeParse(await parseJsonBody(request));
    if (!parsed.success) return apiError('Please check the branch fields', 400, zodDetails(parsed.error));
    const branch = await updateBranch(parsed.data);
    revalidatePublicContent([CACHE_TAGS.branches], branchPaths(parsed.data.slug));
    return apiOk({ branch });
  });
}
