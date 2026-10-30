import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Rating({ value, className }: { value: number; className?: string }) {
  return (
    <div
      className={cn('flex items-center gap-0.5', className)}
      role="img"
      aria-label={`${value} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            'h-4 w-4',
            index < value ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200',
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
