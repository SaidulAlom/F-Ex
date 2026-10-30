import { Resend } from 'resend';
import { resendConfig } from '@/lib/env';
import { escapeHtml } from '@/lib/sanitize';
import { absoluteUrl, formatDateTime } from '@/lib/utils';
import type { Lead } from '@/lib/types';

const labels: Record<Lead['type'], string> = {
  enquiry: 'Product enquiry',
  repair: 'Repair request',
  reservation: 'Reservation',
  sell: 'Sell / exchange',
  contact: 'Contact form',
};

export async function sendLeadNotification(lead: Lead): Promise<boolean> {
  const config = resendConfig();
  if (!config) {
    console.info('[F-Ex Store] Resend is not configured; lead notification skipped.');
    return false;
  }

  try {
    const resend = new Resend(config.apiKey);
    const subject = `New ${labels[lead.type]} — ${lead.name}`;
    const safe = {
      name: escapeHtml(lead.name),
      phone: escapeHtml(lead.phone),
      email: lead.email ? escapeHtml(lead.email) : '',
      branch: escapeHtml(lead.branch),
      message: escapeHtml(lead.message),
      type: escapeHtml(labels[lead.type]),
      createdAt: escapeHtml(formatDateTime(lead.createdAt)),
    };
    await resend.emails.send({
      from: config.from,
      to: config.to.split(',').map((email) => email.trim()).filter(Boolean),
      subject,
      text: [
        `${safe.type} received from ${lead.name}`,
        `Phone: ${lead.phone}`,
        `Email: ${lead.email || 'Not supplied'}`,
        `Branch: ${lead.branch}`,
        `Message: ${lead.message}`,
        `Open admin: ${absoluteUrl('/admin/leads')}`,
      ].join('\n'),
      html: `
        <div style="font-family:Arial,sans-serif;color:#0B1220;max-width:640px">
          <h1 style="font-size:22px;margin-bottom:8px">New ${safe.type}</h1>
          <p style="color:#526071">Received ${safe.createdAt} IST</p>
          <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%">
            <tr><td><strong>Name</strong></td><td>${safe.name}</td></tr>
            <tr><td><strong>Phone</strong></td><td>${safe.phone}</td></tr>
            <tr><td><strong>Email</strong></td><td>${safe.email || 'Not supplied'}</td></tr>
            <tr><td><strong>Branch</strong></td><td>${safe.branch}</td></tr>
          </table>
          <p><strong>Message</strong></p>
          <p style="white-space:pre-wrap;background:#F7F8FA;padding:14px;border-radius:12px">${safe.message}</p>
          <p><a href="${absoluteUrl('/admin/leads')}" style="display:inline-block;background:#2563EB;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none">Open lead in admin</a></p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('[F-Ex Store] Resend lead notification failed.', error);
    return false;
  }
}
