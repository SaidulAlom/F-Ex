import { withAdmin } from '@/lib/admin-api';
import { getLeads } from '@/lib/data/leads';
import { adminLeadQuerySchema } from '@/lib/validators';
import { apiError, apiOk, zodDetails } from '@/lib/api-response';
import type { ProductBranch } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  return withAdmin(async (user) => {
    const search = new URL(request.url).searchParams;
    const parsed = adminLeadQuerySchema.safeParse({
      q: search.get('q') || undefined,
      type: search.get('type') || undefined,
      status: search.get('status') || undefined,
      branch: search.get('branch') || undefined,
      limit: search.get('limit') || undefined,
    });
    if (!parsed.success) return apiError('Invalid lead filters', 400, zodDetails(parsed.error));
    const staffBranch = user.role === 'Owner' ? undefined : (user.branch as ProductBranch);
    const leads = await getLeads({ ...parsed.data, staffBranch });
    return apiOk({ leads }, 200);
  });
}
