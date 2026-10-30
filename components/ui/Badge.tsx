import { cn } from '@/lib/utils';

type Tone = 'blue' | 'orange' | 'green' | 'red' | 'slate' | 'white';

const tones: Record<Tone, string> = {
  blue: 'bg-electric/10 text-blue-800 border-electric/20',
  orange: 'bg-orange/10 text-orange-700 border-orange/20',
  green: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
  white: 'bg-white/90 text-navy border-white/30',
};

export function Badge({
  children,
  tone = 'slate',
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
