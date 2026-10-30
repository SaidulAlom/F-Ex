'use client';

import { Circle } from 'lucide-react';
import { useOpenStatus } from '@/hooks/use-open-status';
import { cn } from '@/lib/utils';
import type { Branch } from '@/lib/types';

export function OpenStatusPill({
  branch,
  showDetail = false,
  inverse = false,
  className,
}: {
  branch: Pick<Branch, 'hours' | 'name'>;
  showDetail?: boolean;
  inverse?: boolean;
  className?: string;
}) {
  const status = useOpenStatus(branch);
  const isOpen = status?.open;
  return (
    <span
      aria-live="polite"
      aria-label={`${branch.name} is ${status?.label || 'checking opening status'}`}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold',
        isOpen === undefined && 'border-white/20 bg-white/10 text-white',
        isOpen === true &&
          (inverse
            ? 'border-emerald-300/30 bg-emerald-400/15 text-emerald-100'
            : 'border-emerald-200 bg-emerald-50 text-emerald-800'),
        isOpen === false &&
          (inverse
            ? 'border-rose-300/20 bg-rose-400/10 text-rose-100'
            : 'border-rose-200 bg-rose-50 text-rose-700'),
        className,
      )}
    >
      <Circle
        className={cn(
          'h-2 w-2 fill-current',
          isOpen === undefined && 'animate-pulse',
          isOpen === true && 'text-emerald-500',
          isOpen === false && 'text-rose-500',
        )}
        aria-hidden="true"
      />
      {status?.label || 'Checking hours'}
      {showDetail && status?.detail ? (
        <span className="hidden font-medium opacity-80 sm:inline">· {status.detail}</span>
      ) : null}
    </span>
  );
}
