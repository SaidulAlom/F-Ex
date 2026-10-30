import { HttpError, withAdmin, parseJsonBody } from '@/lib/admin-api';
import { getLeadById, updateLeadStatus } from '@/lib/data/leads';
import { leadStatusSchema } from '@/lib/validators';
import { apiError, apiOk, zodDetails } from '@/lib/api-response';
import { CACHE_TAGS, revalidatePublicContent } from '@/lib/cache';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return withAdmin(async (user) => {
    const lead = await getLeadById(id);
    if (!lead) throw new HttpError('Lead not found', 404);
    if (user.role !== 'Owner' && lead.branch !== user.branch && lead.branch !== 'both') {
      throw new HttpError('You cannot update another branch’s lead', 403);
    }
    const parsed = leadStatusSchema.safeParse(await parseJsonBody(request));
    if (!parsed.success) return apiError('Invalid status', 400, zodDetails(parsed.error));
    const updated = await updateLeadStatus(id, parsed.data.status);
    revalidatePublicContent([CACHE_TAGS.leads], ['/admin/leads', '/admin']);
    return apiOk({ lead: updated });
  });
}
