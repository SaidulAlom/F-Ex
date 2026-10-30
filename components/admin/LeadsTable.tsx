'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download, Loader2, Search } from 'lucide-react';
import { FormMessage } from '@/components/forms/FormField';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { buttonStyles } from '@/components/ui/button-styles';
import { adminFetch } from '@/components/admin/admin-api-client';
import { useDebounce } from '@/hooks/use-debounce';
import { formatDateTime } from '@/lib/utils';
import type { Lead, LeadStatus, LeadType, ProductBranch } from '@/lib/types';

const leadTypes: LeadType[] = ['enquiry', 'repair', 'reservation', 'sell', 'contact'];
const statuses: LeadStatus[] = ['New', 'Contacted', 'Closed'];
const branches: (ProductBranch | 'all')[] = ['all', 'lokhra', 'basistha', 'both'];

export function LeadsTable({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [branch, setBranch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const debouncedQ = useDebounce(q, 300);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedQ.trim()) params.set('q', debouncedQ.trim());
    if (type) params.set('type', type);
    if (status) params.set('status', status);
    if (branch && branch !== 'all') params.set('branch', branch);
    params.set('limit', '100');
    return params;
  }, [branch, debouncedQ, status, type]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await adminFetch<{ leads: Lead[] }>(`/api/admin/leads?${query.toString()}`);
        if (!cancelled) setLeads(data.leads);
      } catch (caught) {
        if (!cancelled) setError(caught instanceof Error ? caught.message : 'Could not load leads.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [query]);

  const updateStatus = async (lead: Lead, next: LeadStatus) => {
    setError('');
    setSuccess('');
    const previous = leads;
    setLeads((items) => items.map((item) => item.id === lead.id ? { ...item, status: next } : item));
    try {
      await adminFetch(`/api/admin/leads/${lead.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: next }),
      });
      setSuccess(`Lead from ${lead.name} marked ${next}.`);
    } catch (caught) {
      setLeads(previous);
      setError(caught instanceof Error ? caught.message : 'Could not update lead.');
    }
  };

  const clearFilters = () => {
    setQ('');
    setType('');
    setStatus('');
    setBranch('');
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-line bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))_auto]">
          <label className="relative block">
            <span className="sr-only">Search leads</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input value={q} onChange={(event) => setQ(event.target.value)} className="admin-input pl-9" placeholder="Name, phone, message…" />
          </label>
          <label className="block">
            <span className="sr-only">Filter by type</span>
            <select value={type} onChange={(event) => setType(event.target.value)} className="admin-input">
              <option value="">All types</option>
              {leadTypes.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Filter by status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="admin-input">
              <option value="">All statuses</option>
              {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Filter by branch</span>
            <select value={branch || 'all'} onChange={(event) => setBranch(event.target.value)} className="admin-input">
              {branches.map((item) => <option key={item} value={item}>{item === 'all' ? 'All branches' : item}</option>)}
            </select>
          </label>
          <button type="button" onClick={clearFilters} className={buttonStyles({ variant: 'outline', size: 'md' })}>Clear</button>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
          <p className="text-xs font-semibold text-ink">{loading ? 'Refreshing…' : `${leads.length} lead${leads.length === 1 ? '' : 's'} shown`}</p>
          <a href={`/api/admin/leads/export?${query.toString()}`} className={buttonStyles({ variant: 'navy', size: 'sm' })}>
            <Download className="h-4 w-4" aria-hidden="true" />Export CSV
          </a>
        </div>
      </div>

      <FormMessage success={success} error={error} />

      {!leads.length && !loading ? (
        <EmptyState title="No leads match" description="Try clearing filters. New public form submissions will appear here immediately." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
          <table className="w-full min-w-[1050px] border-collapse text-left text-sm">
            <thead className="bg-cloud text-xs uppercase tracking-wide text-ink">
              <tr>
                <th className="p-3 font-bold">Received</th>
                <th className="p-3 font-bold">Customer</th>
                <th className="p-3 font-bold">Type</th>
                <th className="p-3 font-bold">Branch</th>
                <th className="p-3 font-bold">Message</th>
                <th className="p-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {leads.map((lead) => (
                <tr key={lead.id} className="align-top hover:bg-cloud/50">
                  <td className="whitespace-nowrap p-3 text-xs text-ink">{formatDateTime(lead.createdAt)}</td>
                  <td className="p-3">
                    <p className="font-bold text-navy">{lead.name}</p>
                    <a href={`tel:${lead.phone.replace(/[^\d+]/g, '')}`} className="text-xs text-electric hover:underline">{lead.phone}</a>
                    {lead.email ? <p className="text-xs text-ink">{lead.email}</p> : null}
                  </td>
                  <td className="p-3"><Badge tone="blue">{lead.type}</Badge></td>
                  <td className="p-3 text-xs font-semibold text-ink">{lead.branch}</td>
                  <td className="max-w-sm p-3">
                    <p className="line-clamp-3 text-xs leading-5 text-ink" title={lead.message}>{lead.message}</p>
                    <div className="mt-1 flex flex-wrap gap-2 text-[11px] font-semibold text-electric">
                      {lead.productTitle ? <span>{lead.productTitle}</span> : null}
                      {lead.issueType ? <span>{lead.issueType}</span> : null}
                      {lead.photoUrl ? <a href={lead.photoUrl} target="_blank" rel="noopener noreferrer" className="underline">Photo</a> : null}
                      {lead.source ? <span className="text-ink">· {lead.source}</span> : null}
                    </div>
                  </td>
                  <td className="p-3">
                    <select value={lead.status} onChange={(event) => void updateStatus(lead, event.target.value as LeadStatus)} className="rounded-lg border border-line bg-white px-2 py-1.5 text-xs font-bold text-navy" aria-label={`Status for lead from ${lead.name}`}>
                      {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading ? <div className="flex items-center gap-2 border-t border-line p-3 text-xs text-ink"><Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />Loading filtered leads…</div> : null}
        </div>
      )}
    </div>
  );
}
