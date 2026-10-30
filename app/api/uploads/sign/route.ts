import { type NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/api-auth';
import { signUpload } from '@/lib/cloudinary';
import { cloudinaryConfig } from '@/lib/env';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { uploadSignSchema } from '@/lib/validators';
import { apiError, apiOk, zodDetails } from '@/lib/api-response';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const limiter = rateLimit(`upload:${clientIp(request)}`, 12, 60_000);
  if (!limiter.success) {
    return NextResponse.json(
      { ok: false, message: 'Too many uploads. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(limiter.retryAfter) } },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = uploadSignSchema.safeParse(body);
  if (!parsed.success) return apiError('Invalid upload context', 400, zodDetails(parsed.error));
  if (parsed.data.context === 'product') {
    const admin = await getAdminUser();
    if (!admin) return apiError('Admin login required for product uploads', 401);
  }

  const config = cloudinaryConfig();
  if (!config) return apiError('Cloudinary is not configured', 503);

  try {
    const timestamp = Math.round(Date.now() / 1000);
    const folder =
      parsed.data.context === 'repair'
        ? `${config.folder}/repair-requests`
        : `${config.folder}/products`;
    const signature = signUpload({ timestamp, folder });
    return apiOk({
      cloudName: config.cloudName,
      apiKey: config.apiKey,
      timestamp,
      signature,
      folder,
    });
  } catch (error) {
    console.error('[F-Ex Store] Cloudinary signing failed.', error);
    return apiError('Could not create an upload signature', 500);
  }
}
