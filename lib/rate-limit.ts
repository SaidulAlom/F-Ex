import type { NextRequest } from 'next/server';

interface Bucket {
  count: number;
  resetAt: number;
}

/**
 * Small in-process limiter suitable for a single Node instance. On Vercel each
 * lambda has its own map; swap this implementation for Upstash Redis if high
 * traffic or coordinated multi-region limiting is required.
 */
const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  limit = 6,
  windowMs = 60_000,
): { success: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, retryAfter: 0 };
  }
  if (bucket.count >= limit) {
    return {
      success: false,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }
  bucket.count += 1;
  return { success: true, remaining: limit - bucket.count, retryAfter: 0 };
}

export function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return (
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown'
  );
}
