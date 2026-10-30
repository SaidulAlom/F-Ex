import { connectToDatabase } from '@/lib/mongodb';
import { isDatabaseConfigured, isDemoMode } from '@/lib/env';

export type DataMode = 'db' | 'demo';

export async function requireWriteMode(): Promise<DataMode> {
  if (isDatabaseConfigured()) {
    await connectToDatabase();
    return 'db';
  }
  if (isDemoMode()) return 'demo';
  throw new Error(
    'No database is configured. Add MONGODB_URI or set DEMO_MODE=true for a local preview.',
  );
}

/** Public reads fall back to sample data if MongoDB is absent or unreachable. */
export async function withReadFallback<T>(
  databaseRead: () => Promise<T>,
  fallbackRead: () => T | Promise<T>,
): Promise<T> {
  if (!isDatabaseConfigured()) return fallbackRead();
  try {
    await connectToDatabase();
    return await databaseRead();
  } catch (error) {
    console.error('[F-Ex Store] Database read failed; using demo content.', error);
    return fallbackRead();
  }
}
