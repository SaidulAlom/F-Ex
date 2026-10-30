import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createLead } from '@/lib/data/leads';
import { sendLeadNotification } from '@/lib/email';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { leadInputSchema, leadToRecord } from '@/lib/validators';
import { apiError, apiOk, zodDetails } from '@/lib/api-response';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const honeypotCheck = z.object({
  companyWebsite: z.string().max(200).optional(),
});

export async function POST(request: NextRequest) {
  const limiter = rateLimit(`lead:${clientIp(request)}`, 6, 60_000);
  if (!limiter.success) {
    return NextResponse.json(
      {
        ok: false,
        message: 'You’ve sent several requests. Please wait a minute and try again.',
      },
      { status: 429, headers: { 'Retry-After': String(limiter.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError('Invalid request body');
  }

  // Silently accept obvious bot submissions without storing or emailing them.
  const honeypot = honeypotCheck.safeParse(body);
  if (honeypot.success && honeypot.data.companyWebsite?.trim()) {
    return apiOk({ message: 'Thank you — your request has been received.' });
  }

  const parsed = leadInputSchema.safeParse(body);
  if (!parsed.success) {
    return apiError('Please check the highlighted fields.', 400, zodDetails(parsed.error));
  }

  try {
    const lead = await createLead(leadToRecord(parsed.data));
    const emailSent = await sendLeadNotification(lead);
    return apiOk(
      {
        message: 'Thank you — our team has your request and will contact you shortly.',
        leadId: lead.id,
        emailSent,
      },
      201,
    );
  } catch (error) {
    console.error('[F-Ex Store] Lead creation failed.', error);
    return apiError(
      'We could not save your request right now. Please call or WhatsApp us instead.',
      500,
    );
  }
}
