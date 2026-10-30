import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { SessionUserLike } from '@/lib/permissions';

export async function getAdminUser(): Promise<SessionUserLike | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
    branch: session.user.branch,
  };
}

export function requireOwner(user: SessionUserLike | null): boolean {
  return user?.role === 'Owner';
}
