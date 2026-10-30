import { Types } from 'mongoose';
import { LeadModel } from '@/models/Lead';
import { getDemoStore, demoId } from '@/lib/demo-store';
import { escapeRegExp } from '@/lib/sanitize';
import { withReadFallback } from '@/lib/data/common';
import { serializeDocument, serializeDocuments } from '@/lib/serialization';
import type { Lead, LeadStatus, LeadType, ProductBranch } from '@/lib/types';

export interface LeadQuery {
  q?: string;
  type?: LeadType;
  status?: LeadStatus;
  branch?: ProductBranch;
  staffBranch?: ProductBranch;
  limit?: number;
}

export type NewLead = Omit<Lead, 'id' | 'status' | 'createdAt' | 'updatedAt'>;

function matchesDemoLead(lead: Lead, query: LeadQuery): boolean {
  const q = query.q?.trim().toLowerCase();
  if (q) {
    const haystack = `${lead.name} ${lead.phone} ${lead.email || ''} ${lead.message} ${lead.productTitle || ''}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  if (query.type && lead.type !== query.type) return false;
  if (query.status && lead.status !== query.status) return false;
  if (query.branch && lead.branch !== query.branch) return false;
  if (query.staffBranch) {
    if (lead.branch !== query.staffBranch && lead.branch !== 'both') return false;
  }
  return true;
}

export async function getLeads(query: LeadQuery = {}): Promise<Lead[]> {
  const limit = query.limit ?? 100;
  return withReadFallback<Lead[]>(
    async () => {
      const filter: Record<string, unknown> = {};
      if (query.q) {
        const expression = new RegExp(escapeRegExp(query.q), 'i');
        filter.$or = [
          { name: expression },
          { phone: expression },
          { message: expression },
          { productTitle: expression },
          { email: expression },
        ];
      }
      if (query.type) filter.type = query.type;
      if (query.status) filter.status = query.status;
      if (query.branch) filter.branch = query.branch;
      if (query.staffBranch) filter.branch = { $in: [query.staffBranch, 'both'] };
      return serializeDocuments<Lead>(
        await LeadModel.find(filter).sort({ createdAt: -1 }).limit(limit).lean(),
      );
    },
    () =>
      getDemoStore()
        .leads.filter((lead) => matchesDemoLead(lead, query))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit),
  );
}

export async function getLeadById(id: string): Promise<Lead | null> {
  return withReadFallback<Lead | null>(
    async () => {
      if (!Types.ObjectId.isValid(id)) return null;
      const document = await LeadModel.findById(id).lean();
      return document ? serializeDocument<Lead>(document) : null;
    },
    () => getDemoStore().leads.find((lead) => lead.id === id) || null,
  );
}

export async function createLead(input: NewLead): Promise<Lead> {
  const { requireWriteMode } = await import('@/lib/data/common');
  const mode = await requireWriteMode();
  const now = new Date().toISOString();

  if (mode === 'db') {
    const document = await LeadModel.create({ ...input, status: 'New' });
    return serializeDocument<Lead>(document);
  }

  const lead: Lead = {
    ...input,
    id: demoId('lead'),
    status: 'New',
    createdAt: now,
    updatedAt: now,
  };
  getDemoStore().leads.unshift(lead);
  return lead;
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead | null> {
  const { requireWriteMode } = await import('@/lib/data/common');
  const mode = await requireWriteMode();
  if (mode === 'db') {
    if (!Types.ObjectId.isValid(id)) return null;
    const document = await LeadModel.findByIdAndUpdate(id, { status }, { new: true }).lean();
    return document ? serializeDocument<Lead>(document) : null;
  }
  const lead = getDemoStore().leads.find((item) => item.id === id);
  if (!lead) return null;
  lead.status = status;
  lead.updatedAt = new Date().toISOString();
  return lead;
}
