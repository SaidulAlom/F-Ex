'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import { adminFetch } from '@/components/admin/admin-api-client';
import { FormMessage } from '@/components/forms/FormField';
import { Badge } from '@/components/ui/Badge';
import type { Product } from '@/lib/types';

export function FeaturedProductsManager({ products: initialProducts }: { products: Product[] }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');

  const toggle = async (product: Product) => {
    setSuccess('');
    setError('');
    setBusy(product.id);
    const featured = !product.featured;
    setProducts((items) => items.map((item) => item.id === product.id ? { ...item, featured } : item));
    try {
      await adminFetch(`/api/admin/products/${product.id}/featured`, {
        method: 'PATCH',
        body: JSON.stringify({ featured }),
      });
      setSuccess('Featured selection updated and home page revalidated.');
      router.refresh();
    } catch (caught) {
      setProducts((items) => items.map((item) => item.id === product.id ? { ...item, featured: !featured } : item));
      setError(caught instanceof Error ? caught.message : 'Could not update featured products.');
    } finally {
      setBusy('');
    }
  };

  return (
    <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-navy">Featured products</h2>
          <p className="mt-1 text-xs text-ink">Selected products appear in the home page live stock section.</p>
        </div>
        <Badge tone="blue">{products.filter((product) => product.featured).length} selected</Badge>
      </div>
      <div className="mt-4 grid max-h-96 gap-2 overflow-y-auto sm:grid-cols-2">
        {products.map((product) => (
          <label key={product.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-cloud p-3 text-sm">
            <input
              type="checkbox"
              checked={product.featured}
              disabled={busy === product.id}
              onChange={() => void toggle(product)}
              className="h-4 w-4 accent-blue-600"
            />
            <Star className={`h-4 w-4 shrink-0 ${product.featured ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} aria-hidden="true" />
            <span className="truncate font-semibold text-navy">{product.title}</span>
          </label>
        ))}
      </div>
      <div className="mt-4"><FormMessage success={success} error={error} /></div>
    </section>
  );
}
