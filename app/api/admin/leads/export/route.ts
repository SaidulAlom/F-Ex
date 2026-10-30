import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/admin-api';
import { getLeads } from '@/lib/data/leads';
import { adminLeadQuerySchema } from '@/lib/validators';
import { apiError, zodDetails } from '@/lib/api-response';
import { toCsv } from '@/lib/csv';
import { formatDateTime } from '@/lib/utils';
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
      limit: '500',
    });
    if (!parsed.success) return apiError('Invalid export filters', 400, zodDetails(parsed.error));
    const staffBranch = user.role === 'Owner' ? undefined : (user.branch as ProductBranch);
    const leads = await getLeads({ ...parsed.data, staffBranch });
    const csv = toCsv(leads, [
      { key: 'createdAt', label: 'Created (IST)', value: (lead) => formatDateTime(lead.createdAt) },
      { key: 'status', label: 'Status' },
      { key: 'type', label: 'Type' },
      { key: 'name', label: 'Name' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email' },
      { key: 'branch', label: 'Branch' },
      { key: 'productTitle', label: 'Product' },
      { key: 'issueType', label: 'Issue' },
      { key: 'pickupTime', label: 'Pickup time' },
      { key: 'photoUrl', label: 'Photo' },
      { key: 'source', label: 'Source' },
      { key: 'message', label: 'Message' },
    ]);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="f-ex-store-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
        'Cache-Control': 'no-store',
      },
    });
  });
}
