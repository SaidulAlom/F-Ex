import { PAYMENT_METHODS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function PaymentBadges({
  className,
  size = 'md',
}: {
  className?: string;
  size?: 'sm' | 'md';
}) {
  return (
    <ul className={cn('flex flex-wrap gap-2', className)} aria-label="Accepted payment methods">
      {PAYMENT_METHODS.map((method) => (
        <li
          key={method.name}
          title={method.name}
          className={cn(
            'rounded-lg border font-extrabold tracking-tight',
            method.className,
            size === 'sm' ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs',
          )}
        >
          {method.short}
        </li>
      ))}
    </ul>
  );
}
