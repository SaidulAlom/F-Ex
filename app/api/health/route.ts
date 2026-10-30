import { NextResponse } from 'next/server';
import { isDatabaseConfigured, isDemoMode } from '@/lib/env';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({
    ok: true,
    service: 'f-ex-store',
    databaseConfigured: isDatabaseConfigured(),
    demoMode: isDemoMode(),
    time: new Date().toISOString(),
  });
}
