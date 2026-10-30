import { Reveal } from '@/components/motion/Reveal';

type Icon = React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;

export function FeatureCards({
  items,
}: {
  items: {
    title: string;
    description: string;
    icon: Icon;
    accent?: string;
  }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <Reveal key={item.title} delay={Math.min(index * 0.05, 0.2)}>
            <article className="h-full rounded-2xl border border-line bg-white p-6 shadow-soft">
              <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${item.accent || 'bg-electric/10 text-electric'}`}>
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-lg font-bold text-navy">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink">{item.description}</p>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
