import { Plus } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function FAQ({
  items,
  title = 'Frequently asked questions',
  description = 'Quick answers before you visit or get in touch.',
}: {
  items: readonly { q: string; a: string }[];
  title?: string;
  description?: string;
}) {
  return (
    <section className="bg-white py-14 sm:py-18" aria-labelledby="faq-heading">
      <div className="container-content grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div id="faq-heading">
          <SectionHeading eyebrow="Good to know" title={title} description={description} />
        </div>
        <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
          {items.map((item, index) => (
            <details key={item.q} className="group bg-white p-5 open:bg-cloud/60" open={index === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-navy">
                {item.q}
                <Plus className="h-4 w-4 shrink-0 text-electric transition-transform duration-200 group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="mt-3 pr-8 text-sm leading-6 text-ink">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
