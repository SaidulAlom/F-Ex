import Link from 'next/link';
import { ArrowUpRight, Cable, Recycle, Smartphone, Wrench } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

const categories = [
  {
    title: 'New Phones',
    description: 'Apple, Vivo, Samsung, Redmi and more — sealed with warranty.',
    href: '/new-phones',
    icon: Smartphone,
    className: 'bg-electric text-white',
  },
  {
    title: 'Second-Hand',
    description: 'Inspected pre-owned devices with clear grades and battery health.',
    href: '/second-hand-phones',
    icon: Recycle,
    className: 'bg-navy text-white',
  },
  {
    title: 'Accessories & Gadgets',
    description: 'Chargers, audio, wearables, cables and landline phones.',
    href: '/accessories',
    icon: Cable,
    className: 'bg-white text-navy border border-line',
  },
  {
    title: 'Repair Services',
    description: 'Screen, motherboard, battery, camera and sensor repairs.',
    href: '/repair',
    icon: Wrench,
    className: 'bg-orange text-white',
  },
];

export function CategoryTiles() {
  return (
    <section className="bg-cloud py-14 sm:py-18">
      <div className="container-content">
        <Reveal>
          <SectionHeading
            eyebrow="Shop by need"
            title="Everything for your mobile life."
            description="Browse live stock, compare conditions, and choose pickup or same-day local delivery."
          />
        </Reveal>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Reveal key={category.href} delay={index * 0.06}>
                <Link
                  href={category.href}
                  className={`group flex h-full min-h-60 flex-col rounded-2xl p-6 shadow-soft transition-transform duration-200 hover:-translate-y-1 ${category.className}`}
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-8 text-xl font-bold">{category.title}</h3>
                  <p className={`mt-2 text-sm leading-6 ${category.className.includes('bg-white') ? 'text-ink' : 'text-white/80'}`}>
                    {category.description}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-extrabold">
                    Explore <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
