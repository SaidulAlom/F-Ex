import type { AdminRole, ProductBranch } from '@/lib/types';

export interface SessionUserLike {
  id?: string;
  name?: string | null;
  email?: string | null;
  role: AdminRole;
  branch: ProductBranch;
}

export function isOwner(user: SessionUserLike): boolean {
  return user.role === 'Owner';
}

export function canManageBranch(user: SessionUserLike, branch: ProductBranch): boolean {
  if (isOwner(user)) return true;
  // Staff may only edit stock explicitly assigned to their branch. A product
  // shared by both branches is owner-managed.
  return branch !== 'both' && user.branch === branch;
}

export function branchScope(user: SessionUserLike): ProductBranch | undefined {
  return isOwner(user) ? undefined : user.branch;
}
