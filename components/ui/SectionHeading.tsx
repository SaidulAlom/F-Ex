import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  inverse = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  inverse?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow ? (
        <Badge tone={inverse ? 'white' : 'blue'} className="mb-4">
          {eyebrow}
        </Badge>
      ) : null}
      <h2
        className={cn(
          'text-3xl font-extrabold leading-tight sm:text-4xl',
          inverse ? 'text-white' : 'text-navy',
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            'mt-4 text-base leading-7',
            inverse ? 'text-blue-100' : 'text-ink',
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
