import { cn } from '@/lib/utils';

type Variant = 'primary' | 'orange' | 'navy' | 'outline' | 'ghost' | 'white' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: 'bg-electric text-white shadow-glow hover:bg-blue-700',
  orange: 'bg-orange text-white shadow-glow hover:bg-orange-600',
  navy: 'bg-navy text-white shadow-soft hover:bg-slate-900',
  outline: 'border border-line bg-white text-navy hover:border-electric hover:text-electric',
  ghost: 'text-navy hover:bg-navy/5',
  white: 'bg-white text-navy shadow-soft hover:bg-slate-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const sizes: Record<Size, string> = {
  sm: 'px-3.5 py-2 text-xs',
  md: 'px-5 py-3 text-sm',
  lg: 'px-6 py-3.5 text-base',
};

export function buttonStyles({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(
    'focus-ring inline-flex items-center justify-center gap-2 rounded-xl font-bold transition duration-200 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60',
    variants[variant],
    sizes[size],
    className,
  );
}
