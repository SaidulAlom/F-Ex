'use client';

import { useEffect, useState } from 'react';
import { getBranchOpenStatus, type BranchOpenStatus } from '@/lib/branch-hours';
import type { Branch } from '@/lib/types';

/** Recalculates in the browser every minute, always using IST in branch-hours. */
export function useOpenStatus(
  branch: Pick<Branch, 'hours'>,
): BranchOpenStatus | null {
  const [status, setStatus] = useState<BranchOpenStatus | null>(null);
  useEffect(() => {
    const update = () => setStatus(getBranchOpenStatus(branch, new Date()));
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, [branch]);
  return status;
}
