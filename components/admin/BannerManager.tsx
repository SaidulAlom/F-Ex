'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CalendarDays, Pencil, Plus, Trash2 } from 'lucide-react';
import { CloudinaryUploader } from '@/components/forms/CloudinaryUploader';
import { FormField, FormMessage } from '@/components/forms/FormField';
import { SmartImage } from '@/components/ui/SmartImage';
import { Badge } from '@/components/ui/Badge';
import { buttonStyles } from '@/components/ui/button-styles';
import { adminFetch } from '@/components/admin/admin-api-client';
import { trackFormSubmission } from '@/lib/analytics';
import { formatDateTime, istDateTimeLocalToIso, toDateTimeLocalValue } from '@/lib/utils';
import { bannerSchema } from '@/lib/validators';
import type { Banner } from '@/lib/types';

const demoImages = [
  '/images/banners/hero-phones.webp',
  '/images/banners/weekend-offer.webp',
  '/images/banners/repair-offer.webp',
];

type BannerDefaults = {
  title: string;
  subtitle: string;
  badge: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
  type: 'hero' | 'offer';
  active: boolean;
  startDate: string;
  endDate: string;
  position: number;
  theme: 'navy' | 'blue' | 'orange';
};

function defaults(): BannerDefaults {
  const now = new Date();
  return {
    title: '',
    subtitle: '',
    badge: '',
    ctaLabel: 'Shop now',
    ctaHref: '/shop',
    image: demoImages[0],
    imageAlt: 'F-Ex Store promotional banner',
    type: 'offer',
    active: true,
    startDate: toDateTimeLocalValue(new Date(now.getTime() - 86_400_000)),
    endDate: toDateTimeLocalValue(new Date(now.getTime() + 30 * 86_400_000)),
    position: 1,
    theme: 'navy',
  };
}

export function BannerManager({ banners: initialBanners }: { banners: Banner[] }) {
  const router = useRouter();
  const [banners, setBanners] = useState(initialBanners);
  const [editingId, setEditingId] = useState('');
  const [image, setImage] = useState<string>(demoImages[0]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(bannerSchema), defaultValues: defaults() });

  useEffect(() => setValue('image', image, { shouldValidate: true }), [image, setValue]);

  const startNew = () => {
    setEditingId('');
    setImage(demoImages[0]);
    reset(defaults());
  };

  const edit = (banner: Banner) => {
    setEditingId(banner.id);
    setImage(banner.image);
    reset({
      title: banner.title,
      subtitle: banner.subtitle,
      badge: banner.badge || '',
      ctaLabel: banner.ctaLabel,
      ctaHref: banner.ctaHref,
      image: banner.image,
      imageAlt: banner.imageAlt,
      type: banner.type,
      active: banner.active,
      startDate: toDateTimeLocalValue(banner.startDate),
      endDate: toDateTimeLocalValue(banner.endDate),
      position: banner.position,
      theme: banner.theme,
    });
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  const remove = async (banner: Banner) => {
    if (!window.confirm(`Delete banner “${banner.title}”?`)) return;
    setError('');
    try {
      await adminFetch(`/api/admin/banners/${banner.id}`, { method: 'DELETE' });
      setBanners((items) => items.filter((item) => item.id !== banner.id));
      setSuccess('Banner deleted.');
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Delete failed.');
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-navy">{editingId ? 'Edit banner' : 'Create banner / offer'}</h2>
          <button type="button" onClick={startNew} className={buttonStyles({ variant: 'outline', size: 'sm' })}><Plus className="h-4 w-4" aria-hidden="true" />New</button>
        </div>
        <form
          onSubmit={handleSubmit(async (values) => {
            setSuccess('');
            setError('');
            const payload = {
              ...values,
              image,
              startDate: istDateTimeLocalToIso(values.startDate),
              endDate: istDateTimeLocalToIso(values.endDate),
            };
            const parsed = bannerSchema.safeParse(payload);
            if (!parsed.success) {
              setError(parsed.error.issues.map((issue) => issue.message).join(' '));
              return;
            }
            try {
              const data = await adminFetch<{ banner: Banner }>(
                editingId ? `/api/admin/banners/${editingId}` : '/api/admin/banners',
                { method: editingId ? 'PUT' : 'POST', body: JSON.stringify(parsed.data) },
              );
              setBanners((items) => editingId
                ? items.map((item) => item.id === editingId ? data.banner : item)
                : [data.banner, ...items]);
              trackFormSubmission('admin_banner', { action: editingId ? 'update' : 'create' });
              setSuccess('Banner saved. Active dates now control public visibility.');
              router.refresh();
              startNew();
            } catch (caught) {
              setError(caught instanceof Error ? caught.message : 'Could not save banner.');
            }
          })}
          className="mt-4 space-y-4"
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Title" htmlFor="banner-title" required error={errors.title?.message} className="sm:col-span-2">
              <input id="banner-title" className="admin-input" {...register('title')} />
            </FormField>
            <FormField label="Subtitle" htmlFor="banner-subtitle" required error={errors.subtitle?.message} className="sm:col-span-2">
              <textarea id="banner-subtitle" rows={2} className="admin-input resize-y" {...register('subtitle')} />
            </FormField>
            <FormField label="Badge" htmlFor="banner-badge" error={errors.badge?.message}>
              <input id="banner-badge" className="admin-input" placeholder="Limited offer" {...register('badge')} />
            </FormField>
            <FormField label="CTA label" htmlFor="banner-cta-label" required error={errors.ctaLabel?.message}>
              <input id="banner-cta-label" className="admin-input" {...register('ctaLabel')} />
            </FormField>
            <FormField label="CTA link" htmlFor="banner-cta-href" required error={errors.ctaHref?.message} className="sm:col-span-2">
              <input id="banner-cta-href" className="admin-input" placeholder="/shop or https://…" {...register('ctaHref')} />
            </FormField>
            <FormField label="Type" htmlFor="banner-type" error={errors.type?.message}>
              <select id="banner-type" className="admin-input" {...register('type')}>
                <option value="offer">Offer card</option>
                <option value="hero">Homepage hero</option>
              </select>
            </FormField>
            <FormField label="Theme" htmlFor="banner-theme" error={errors.theme?.message}>
              <select id="banner-theme" className="admin-input" {...register('theme')}>
                <option value="navy">Navy</option>
                <option value="blue">Electric blue</option>
                <option value="orange">Orange</option>
              </select>
            </FormField>
            <FormField label="Start date" htmlFor="banner-start" required error={errors.startDate?.message}>
              <input id="banner-start" type="datetime-local" className="admin-input" {...register('startDate')} />
            </FormField>
            <FormField label="End date" htmlFor="banner-end" required error={errors.endDate?.message}>
              <input id="banner-end" type="datetime-local" className="admin-input" {...register('endDate')} />
            </FormField>
            <FormField label="Position" htmlFor="banner-position" error={errors.position?.message}>
              <input id="banner-position" type="number" min={0} className="admin-input" {...register('position', { valueAsNumber: true })} />
            </FormField>
            <FormField label="Image alt text" htmlFor="banner-alt" required error={errors.imageAlt?.message}>
              <input id="banner-alt" className="admin-input" {...register('imageAlt')} />
            </FormField>
          </div>
          <label className="flex items-center gap-2 text-sm font-bold text-navy"><input type="checkbox" className="h-4 w-4 accent-blue-600" {...register('active')} />Active within dates</label>
          <div>
            <p className="form-label">Banner image</p>
            <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
              <div className="relative aspect-video overflow-hidden rounded-xl border border-line bg-cloud">
                <SmartImage src={image} alt="Banner preview" fill sizes="160px" className="object-cover" />
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {demoImages.map((path) => (
                    <button key={path} type="button" onClick={() => setImage(path)} className={`rounded-lg border px-2.5 py-1.5 text-xs font-bold ${image === path ? 'border-electric text-electric' : 'border-line text-ink'}`}>
                      {path.split('/').pop()?.replace('.webp', '')}
                    </button>
                  ))}
                </div>
                <CloudinaryUploader context="product" maxFiles={1} compact label="Upload a banner image" onUploaded={(images) => setImage(images[0]?.url || image)} />
              </div>
            </div>
            {errors.image?.message ? <p className="form-error">{String(errors.image.message)}</p> : null}
          </div>
          <FormMessage success={success} error={error} />
          <button type="submit" disabled={isSubmitting} className={buttonStyles({ variant: 'primary' })}>
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            {isSubmitting ? 'Saving…' : editingId ? 'Save banner' : 'Create banner'}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-navy">All banners & offers</h2>
        <div className="mt-4 space-y-3">
          {banners.length ? banners.map((banner) => (
            <article key={banner.id} className="flex gap-3 rounded-xl border border-line bg-cloud p-3">
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-white">
                <SmartImage src={banner.image} alt="" fill sizes="112px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-1.5"><Badge tone={banner.active ? 'green' : 'red'}>{banner.active ? 'Active' : 'Inactive'}</Badge><Badge tone="slate">{banner.type}</Badge></div>
                <h3 className="mt-2 truncate text-sm font-bold text-navy">{banner.title}</h3>
                <p className="text-xs text-ink">{formatDateTime(banner.startDate)} → {formatDateTime(banner.endDate)}</p>
                <div className="mt-2 flex gap-2">
                  <button type="button" onClick={() => edit(banner)} className="rounded-lg border border-line bg-white p-1.5 text-electric" aria-label={`Edit ${banner.title}`}><Pencil className="h-3.5 w-3.5" /></button>
                  <button type="button" onClick={() => void remove(banner)} className="rounded-lg border border-red-200 bg-white p-1.5 text-red-600" aria-label={`Delete ${banner.title}`}><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </article>
          )) : <p className="text-sm text-ink">No banners yet.</p>}
        </div>
      </section>
    </div>
  );
}
