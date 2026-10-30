import type { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/api-auth';
import { apiError } from '@/lib/api-response';
import type { SessionUserLike } from '@/lib/permissions';

export class HttpError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

export async function parseJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new HttpError('Invalid JSON body');
  }
}

export async function withAdmin<T extends NextResponse>(
  handler: (user: SessionUserLike) => Promise<T>,
): Promise<NextResponse> {
  try {
    const user = await getAdminUser();
    if (!user) throw new HttpError('Unauthorized', 401);
    return await handler(user);
  } catch (error) {
    if (error instanceof HttpError) return apiError(error.message, error.status);
    console.error('[F-Ex Store] Admin API error.', error);
    const message =
      error instanceof Error && error.message.includes('No database is configured')
        ? error.message
        : 'The request could not be completed.';
    return apiError(message, 500);
  }
}

export function requireOwner(user: SessionUserLike): void {
  if (user.role !== 'Owner') throw new HttpError('Owner access required', 403);
}

export function requireBranchAccess(user: SessionUserLike, ...branches: string[]): void {
  if (user.role === 'Owner') return;
  const allowed = branches.every((branch) => branch !== 'both' && branch === user.branch);
  if (!allowed) throw new HttpError('You can only manage your own branch stock', 403);
}
