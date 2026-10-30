import { Reveal } from '@/components/motion/Reveal';

export function StepGrid({
  items,
}: {
  items: readonly { number?: string; title: string; description: string }[];
}) {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <Reveal key={item.title} delay={index * 0.06}>
          <li className="h-full rounded-2xl border border-line bg-white p-5 shadow-soft">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-electric/10 text-sm font-extrabold text-electric">
              {item.number || String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="mt-6 text-lg font-bold text-navy">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-ink">{item.description}</p>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}
