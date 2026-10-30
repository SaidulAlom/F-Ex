'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { MessageSquareQuote, Pencil, Plus, Trash2 } from 'lucide-react';
import { FormField, FormMessage } from '@/components/forms/FormField';
import { Rating } from '@/components/ui/Rating';
import { Badge } from '@/components/ui/Badge';
import { buttonStyles } from '@/components/ui/button-styles';
import { adminFetch } from '@/components/admin/admin-api-client';
import { trackFormSubmission } from '@/lib/analytics';
import { testimonialSchema } from '@/lib/validators';
import type { Testimonial } from '@/lib/types';

const defaults = {
  name: '',
  location: 'Guwahati',
  quote: '',
  rating: 5,
  approved: false,
};

export function TestimonialManager({ testimonials: initialItems }: { testimonials: Testimonial[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(testimonialSchema), defaultValues: defaults });

  const edit = (item: Testimonial) => {
    setEditingId(item.id);
    reset({ name: item.name, location: item.location, quote: item.quote, rating: item.rating, approved: item.approved });
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  const remove = async (item: Testimonial) => {
    if (!window.confirm(`Delete the review from ${item.name}?`)) return;
    setError('');
    try {
      await adminFetch(`/api/admin/testimonials/${item.id}`, { method: 'DELETE' });
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      setSuccess('Testimonial deleted.');
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Delete failed.');
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-navy">{editingId ? 'Edit review' : 'Add review'}</h2>
          <button type="button" onClick={() => { setEditingId(''); reset(defaults); }} className={buttonStyles({ variant: 'outline', size: 'sm' })}><Plus className="h-4 w-4" aria-hidden="true" />New</button>
        </div>
        <form
          onSubmit={handleSubmit(async (values) => {
            setSuccess('');
            setError('');
            try {
              const data = await adminFetch<{ testimonial: Testimonial }>(
                editingId ? `/api/admin/testimonials/${editingId}` : '/api/admin/testimonials',
                { method: editingId ? 'PUT' : 'POST', body: JSON.stringify(values) },
              );
              setItems((current) => editingId
                ? current.map((entry) => entry.id === editingId ? data.testimonial : entry)
                : [data.testimonial, ...current]);
              trackFormSubmission('admin_testimonial', { action: editingId ? 'update' : 'create' });
              setSuccess('Review saved. Only approved reviews appear on the public site.');
              router.refresh();
              setEditingId('');
              reset(defaults);
            } catch (caught) {
              setError(caught instanceof Error ? caught.message : 'Could not save review.');
            }
          })}
          className="mt-4 space-y-4"
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Customer name" htmlFor="testimonial-name" required error={errors.name?.message}>
              <input id="testimonial-name" className="admin-input" {...register('name')} />
            </FormField>
            <FormField label="Location" htmlFor="testimonial-location" required error={errors.location?.message}>
              <input id="testimonial-location" className="admin-input" {...register('location')} />
            </FormField>
          </div>
          <FormField label="Review text" htmlFor="testimonial-quote" required error={errors.quote?.message}>
            <textarea id="testimonial-quote" rows={5} className="admin-input resize-y" {...register('quote')} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Rating" htmlFor="testimonial-rating" error={errors.rating?.message}>
              <select id="testimonial-rating" className="admin-input" {...register('rating', { valueAsNumber: true })}>
                {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} star{rating > 1 ? 's' : ''}</option>)}
              </select>
            </FormField>
            <label className="mt-7 flex items-center gap-2 text-sm font-bold text-navy"><input type="checkbox" className="h-4 w-4 accent-blue-600" {...register('approved')} />Approved / public</label>
          </div>
          <FormMessage success={success} error={error} />
          <button type="submit" disabled={isSubmitting} className={buttonStyles({ variant: 'primary' })}>
            <MessageSquareQuote className="h-4 w-4" aria-hidden="true" />
            {isSubmitting ? 'Saving…' : 'Save review'}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-navy">Curated reviews</h2>
        <div className="mt-4 grid gap-3">
          {items.length ? items.map((item) => (
            <article key={item.id} className="rounded-xl border border-line bg-cloud p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div><p className="text-sm font-bold text-navy">{item.name}</p><p className="text-xs text-ink">{item.location}</p></div>
                <Badge tone={item.approved ? 'green' : 'slate'}>{item.approved ? 'Approved' : 'Hidden'}</Badge>
              </div>
              <Rating value={item.rating} className="mt-3" />
              <p className="mt-2 line-clamp-3 text-sm text-ink">“{item.quote}”</p>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => edit(item)} className="rounded-lg border border-line bg-white p-2 text-electric" aria-label={`Edit review by ${item.name}`}><Pencil className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={() => void remove(item)} className="rounded-lg border border-red-200 bg-white p-2 text-red-600" aria-label={`Delete review by ${item.name}`}><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </article>
          )) : <p className="text-sm text-ink">No testimonials yet.</p>}
        </div>
      </section>
    </div>
  );
}
