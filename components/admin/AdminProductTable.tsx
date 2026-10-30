'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ExternalLink, Pencil, Star, Trash2 } from 'lucide-react';
import { SmartImage } from '@/components/ui/SmartImage';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { FormMessage } from '@/components/forms/FormField';
import { buttonStyles } from '@/components/ui/button-styles';
import { adminFetch } from '@/components/admin/admin-api-client';
import { STATUS_OPTIONS } from '@/lib/constants';
import { priceLabel } from '@/lib/utils';
import type { AdminRole, Product, ProductStatus } from '@/lib/types';

export function AdminProductTable({
  products: initialProducts,
  userRole,
}: {
  products: Product[];
  userRole: AdminRole;
}) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');

  const updateStatus = async (product: Product, status: ProductStatus) => {
    setError('');
    setMessage('');
    setBusy(product.id);
    const previous = products;
    setProducts((items) => items.map((item) => item.id === product.id ? { ...item, status } : item));
    try {
      await adminFetch(`/api/admin/products/${product.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setMessage(`${product.title} is now ${status}. Public pages were revalidated.`);
      router.refresh();
    } catch (caught) {
      setProducts(previous);
      setError(caught instanceof Error ? caught.message : 'Status update failed.');
    } finally {
      setBusy('');
    }
  };

  const toggleFeatured = async (product: Product) => {
    if (userRole !== 'Owner') return;
    setError('');
    setBusy(product.id);
    const featured = !product.featured;
    setProducts((items) => items.map((item) => item.id === product.id ? { ...item, featured } : item));
    try {
      await adminFetch(`/api/admin/products/${product.id}/featured`, {
        method: 'PATCH',
        body: JSON.stringify({ featured }),
      });
      setMessage(featured ? 'Added to featured products.' : 'Removed from featured products.');
      router.refresh();
    } catch (caught) {
      setProducts((items) => items.map((item) => item.id === product.id ? { ...item, featured: !featured } : item));
      setError(caught instanceof Error ? caught.message : 'Featured update failed.');
    } finally {
      setBusy('');
    }
  };

  const remove = async (product: Product) => {
    if (!window.confirm(`Delete “${product.title}”? This cannot be undone.`)) return;
    setError('');
    setBusy(product.id);
    try {
      await adminFetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
      setProducts((items) => items.filter((item) => item.id !== product.id));
      setMessage('Product deleted.');
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Delete failed.');
    } finally {
      setBusy('');
    }
  };

  if (!products.length) {
    return <EmptyState title="No products found" description="Adjust the filters above or add your first product." />;
  }

  return (
    <div className="space-y-3">
      <FormMessage success={message} error={error} />
      <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
        <table className="w-full min-w-[950px] border-collapse text-left text-sm">
          <thead className="bg-cloud text-xs uppercase tracking-wide text-ink">
            <tr>
              <th className="p-3 font-bold">Product</th>
              <th className="p-3 font-bold">Price</th>
              <th className="p-3 font-bold">Status</th>
              <th className="p-3 font-bold">Branch</th>
              <th className="p-3 font-bold">Featured</th>
              <th className="p-3 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.map((product) => (
              <tr key={product.id} className="align-middle hover:bg-cloud/60">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-line bg-white">
                      <SmartImage src={product.images[0]?.url || '/images/products/generic-product.webp'} alt="" fill sizes="48px" className="object-contain p-1" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-bold text-navy">{product.title}</p>
                      <p className="text-xs text-ink">{product.brand} · {product.condition}{product.grade ? ` · Grade ${product.grade}` : ''}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3 font-bold text-navy">{priceLabel(product)}</td>
                <td className="p-3">
                  <select
                    value={product.status}
                    disabled={busy === product.id}
                    onChange={(event) => void updateStatus(product, event.target.value as ProductStatus)}
                    aria-label={`Change status for ${product.title}`}
                    className="rounded-lg border border-line bg-white px-2 py-1.5 text-xs font-bold text-navy"
                  >
                    {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </td>
                <td className="p-3"><Badge tone="slate">{product.branch}</Badge></td>
                <td className="p-3">
                  <button
                    type="button"
                    disabled={userRole !== 'Owner' || busy === product.id}
                    onClick={() => void toggleFeatured(product)}
                    className={`rounded-lg p-2 ${product.featured ? 'text-amber-500' : 'text-slate-300'} disabled:cursor-not-allowed`}
                    aria-label={`${product.featured ? 'Remove' : 'Add'} ${product.title} ${product.featured ? 'from' : 'to'} featured`}
                    aria-pressed={product.featured}
                  >
                    <Star className={`h-4 w-4 ${product.featured ? 'fill-amber-400' : ''}`} />
                  </button>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1.5">
                    <Link href={`/admin/products/${product.id}/edit`} className="rounded-lg border border-line p-2 text-electric hover:bg-electric/5" aria-label={`Edit ${product.title}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <a href={`/product/${product.slug}`} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-line p-2 text-ink hover:bg-cloud" aria-label={`View ${product.title}`}>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button type="button" disabled={busy === product.id} onClick={() => void remove(product)} className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50" aria-label={`Delete ${product.title}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link href="/admin/products/new" className={buttonStyles({ variant: 'outline', size: 'sm' })}>Add another product</Link>
    </div>
  );
}
