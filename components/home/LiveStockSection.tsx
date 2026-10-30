import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductCard } from '@/components/products/ProductCard';
import { buttonStyles } from '@/components/ui/button-styles';
import type { Product } from '@/lib/types';

export function LiveStockSection({ products }: { products: Product[] }) {
  return (
    <section className="bg-white py-14 sm:py-18">
      <div className="container-content">
        <Reveal>
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Live stock"
              title="Fresh picks, ready in Guwahati."
              description="Featured products are updated from the admin panel and show Reserved or Sold status instead of disappearing."
            />
            <Link href="/shop" className={buttonStyles({ variant: 'outline', className: 'w-fit' })}>
              View all stock <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <Reveal key={product.id} delay={Math.min(index * 0.05, 0.2)}>
              <ProductCard product={product} priority={index < 3} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
