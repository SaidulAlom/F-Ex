'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { ImagePlus, Loader2, Save, X } from 'lucide-react';
import { CloudinaryUploader } from '@/components/forms/CloudinaryUploader';
import { FormField, FormMessage } from '@/components/forms/FormField';
import { SmartImage } from '@/components/ui/SmartImage';
import { buttonStyles } from '@/components/ui/button-styles';
import { adminFetch } from '@/components/admin/admin-api-client';
import {
  BRANCH_OPTIONS,
  CONDITION_OPTIONS,
  CATEGORY_OPTIONS,
  GRADE_OPTIONS,
  STATUS_OPTIONS,
} from '@/lib/constants';
import { trackFormSubmission } from '@/lib/analytics';
import { slugify } from '@/lib/utils';
import { productSchema } from '@/lib/validators';
import type { AdminRole, Product, ProductBranch, ProductImage } from '@/lib/types';

const DEMO_IMAGES = [
  '/images/products/iphone-15-blue.webp',
  '/images/products/vivo-v50-rose-red.webp',
  '/images/products/samsung-s24-fe.webp',
  '/images/products/redmi-note-14-pro-plus.webp',
  '/images/products/nothing-phone-2a.webp',
  '/images/products/accessories.webp',
  '/images/products/boat-airdopes-141.webp',
  '/images/products/panasonic-landline.webp',
  '/images/products/generic-product.webp',
];

export function ProductForm({
  product,
  userRole,
  userBranch,
}: {
  product?: Product;
  userRole: AdminRole;
  userBranch: ProductBranch;
}) {
  const router = useRouter();
  const isEdit = Boolean(product);
  const staffBranch = userRole === 'Owner' ? 'both' : userBranch;
  const [images, setImages] = useState<ProductImage[]>(
    product?.images || [
      { url: DEMO_IMAGES[0], alt: product?.title || 'New F-Ex Store product photo' },
    ],
  );
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: product?.title || '',
      slug: product?.slug || '',
      brand: product?.brand || 'Apple',
      category: product?.category || 'new-phone',
      condition: product?.condition || 'New',
      price: product?.price ?? 0,
      callForPrice: product?.callForPrice || false,
      shortDescription: product?.shortDescription || '',
      description: product?.description || '',
      specs: {
        ram: product?.specs.ram || '',
        storage: product?.specs.storage || '',
        color: product?.specs.color || '',
        display: product?.specs.display || '',
        processor: product?.specs.processor || '',
        camera: product?.specs.camera || '',
        connectivity: product?.specs.connectivity || '',
      },
      images,
      batteryHealth: product?.batteryHealth || '',
      warranty: product?.warranty || '',
      grade: product?.grade || '',
      status: product?.status || 'Available',
      branch: product?.branch || staffBranch,
      featured: product?.featured || false,
    },
  });

  const title = useWatch({ control, name: 'title' });
  const callForPrice = useWatch({ control, name: 'callForPrice' });

  useEffect(() => {
    if (!isEdit) setValue('slug', slugify(title));
  }, [isEdit, setValue, title]);

  useEffect(() => {
    setValue('images', images, { shouldValidate: true });
  }, [images, setValue]);

  const addPlaceholder = () => {
    const url = DEMO_IMAGES[images.length % DEMO_IMAGES.length];
    setImages((current) => [
      ...current,
      { url, alt: title || 'F-Ex Store product photo' },
    ]);
  };

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        setSuccess('');
        setServerError('');
        const payload = { ...values, images };
        const parsed = productSchema.safeParse(payload);
        if (!parsed.success) {
          setServerError(parsed.error.issues.map((issue) => issue.message).join(' '));
          return;
        }
        try {
          await adminFetch(isEdit ? `/api/admin/products/${product?.id}` : '/api/admin/products', {
            method: isEdit ? 'PUT' : 'POST',
            body: JSON.stringify(parsed.data),
          });
          trackFormSubmission('admin_product', {
            action: isEdit ? 'update' : 'create',
            branch: parsed.data.branch,
          });
          setSuccess(isEdit ? 'Product saved and public pages revalidated.' : 'Product published and public pages revalidated.');
          router.push('/admin/products?saved=1');
          router.refresh();
        } catch (error) {
          setServerError(error instanceof Error ? error.message : 'Could not save product.');
        }
      })}
      className="space-y-5"
      noValidate
    >
      <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-navy">1. Product basics</h2>
        <p className="mt-1 text-xs text-ink">The minimum needed to publish: title, brand, category, description, price or “call for price”, and one image.</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <FormField label="Product title" htmlFor="product-title" required error={errors.title?.message} className="lg:col-span-2">
            <input id="product-title" className="admin-input" placeholder="Apple iPhone 15 128GB — Blue" {...register('title')} />
          </FormField>
          <FormField label="URL slug" htmlFor="product-slug" required error={errors.slug?.message}>
            <input id="product-slug" className="admin-input font-mono text-xs" {...register('slug')} />
          </FormField>
          <FormField label="Brand" htmlFor="product-brand" required error={errors.brand?.message}>
            <input id="product-brand" className="admin-input" list="brand-options" {...register('brand')} />
            <datalist id="brand-options">
              {['Apple', 'Vivo', 'Samsung', 'Redmi', 'OnePlus', 'Nothing', 'boAt', 'Panasonic'].map((brand) => <option key={brand} value={brand} />)}
            </datalist>
          </FormField>
          <FormField label="Category" htmlFor="product-category" required error={errors.category?.message}>
            <select id="product-category" className="admin-input" {...register('category')}>
              {CATEGORY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </FormField>
          <FormField label="Condition" htmlFor="product-condition" required error={errors.condition?.message}>
            <select id="product-condition" className="admin-input" {...register('condition')}>
              {CONDITION_OPTIONS.map((condition) => <option key={condition} value={condition}>{condition}</option>)}
            </select>
          </FormField>
          <FormField label="Condition grade (used)" htmlFor="product-grade" error={errors.grade?.message}>
            <select id="product-grade" className="admin-input" {...register('grade')}>
              <option value="">Not graded / new</option>
              {GRADE_OPTIONS.map((grade) => <option key={grade} value={grade}>Grade {grade}</option>)}
            </select>
          </FormField>
          <FormField label="Battery health" htmlFor="product-battery" error={errors.batteryHealth?.message}>
            <input id="product-battery" className="admin-input" placeholder="88%" {...register('batteryHealth')} />
          </FormField>
          <FormField label="Warranty" htmlFor="product-warranty" error={errors.warranty?.message} className="lg:col-span-2">
            <input id="product-warranty" className="admin-input" placeholder="1 year manufacturer warranty" {...register('warranty')} />
          </FormField>
          <FormField label="Short description" htmlFor="product-short" required error={errors.shortDescription?.message} className="lg:col-span-2">
            <input id="product-short" className="admin-input" maxLength={260} {...register('shortDescription')} />
          </FormField>
          <FormField label="Full description" htmlFor="product-description" required error={errors.description?.message} className="lg:col-span-2">
            <textarea id="product-description" rows={5} className="admin-input resize-y" {...register('description')} />
          </FormField>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-navy">2. Price, stock & branch</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <FormField label="Price (INR)" htmlFor="product-price" required={!callForPrice} error={errors.price?.message}>
            <input id="product-price" type="number" min={0} step={1} className="admin-input" disabled={callForPrice} {...register('price', { valueAsNumber: true })} />
          </FormField>
          <FormField label="Status" htmlFor="product-status" required error={errors.status?.message}>
            <select id="product-status" className="admin-input" {...register('status')}>
              {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </FormField>
          <FormField label="Branch" htmlFor="product-branch" required error={errors.branch?.message}>
            <select id="product-branch" className="admin-input disabled:bg-cloud" disabled={userRole !== 'Owner'} {...register('branch')}>
              {BRANCH_OPTIONS
                .filter((option) => userRole === 'Owner' || option.value === userBranch)
                .map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            {userRole !== 'Owner' ? <p className="mt-1 text-xs text-ink">Staff products stay assigned to {userBranch}.</p> : null}
          </FormField>
        </div>
        <div className="mt-4 flex flex-wrap gap-5 rounded-xl bg-cloud p-4 text-sm font-semibold text-navy">
          <label className="flex items-center gap-2"><input type="checkbox" className="h-4 w-4 accent-orange" {...register('callForPrice')} />Call for price</label>
          <label className="flex items-center gap-2"><input type="checkbox" className="h-4 w-4 accent-blue-600" {...register('featured')} />Featured on home</label>
        </div>
        {errors.callForPrice?.message ? <p className="form-error">{errors.callForPrice.message}</p> : null}
      </section>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-navy">3. Specifications</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {([
            ['ram', 'RAM'],
            ['storage', 'Storage'],
            ['color', 'Colour'],
            ['display', 'Display'],
            ['processor', 'Processor'],
            ['camera', 'Camera'],
            ['connectivity', 'Connectivity'],
          ] as const).map(([key, label]) => (
            <FormField key={key} label={`${label} (optional)`} htmlFor={`spec-${key}`} error={errors.specs?.[key]?.message}>
              <input id={`spec-${key}`} className="admin-input" {...register(`specs.${key}`)} />
            </FormField>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-navy">4. Images</h2>
            <p className="mt-1 text-xs text-ink">Cloudinary images are optimised by the site. Bundled demo photos are useful for fast entries; replace them with your own Cloudinary images.</p>
          </div>
          <button type="button" onClick={addPlaceholder} className={buttonStyles({ variant: 'outline', size: 'sm' })}>
            <ImagePlus className="h-4 w-4" aria-hidden="true" />Add demo photo
          </button>
        </div>

        {images.length ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {images.map((item, index) => (
              <div key={`${item.url}-${index}`} className="overflow-hidden rounded-xl border border-line bg-cloud">
                <div className="relative aspect-square bg-white">
                  <SmartImage src={item.url} alt={item.alt} fill sizes="160px" className="object-contain p-3" />
                  <button type="button" onClick={() => setImages((current) => current.filter((_, i) => i !== index))} className="absolute right-2 top-2 rounded-lg bg-white p-1.5 text-red-600 shadow-sm" aria-label={`Remove image ${index + 1}`}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <input
                  value={item.alt}
                  onChange={(event) => setImages((current) => current.map((image, i) => i === index ? { ...image, alt: event.target.value } : image))}
                  className="w-full border-t border-line bg-white px-2 py-2 text-xs"
                  aria-label={`Alt text for image ${index + 1}`}
                />
              </div>
            ))}
          </div>
        ) : null}
        {errors.images?.message ? <p className="form-error">{String(errors.images.message)}</p> : null}

        <div className="mt-4">
          {images.length < 8 ? (
            <CloudinaryUploader
              context="product"
              maxFiles={8 - images.length}
              label="Upload product images to Cloudinary"
              onUploaded={(uploaded) => setImages((current) => [...current, ...uploaded].slice(0, 8))}
            />
          ) : (
            <p className="rounded-xl bg-cloud p-4 text-sm font-semibold text-ink">Maximum of 8 images reached.</p>
          )}
        </div>
      </section>

      <div className="sticky bottom-3 z-10 rounded-2xl border border-line bg-white/95 p-3 shadow-card backdrop-blur-xl">
        <FormMessage success={success} error={serverError} />
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink">Saving calls the admin API, validates with Zod, then purges product cache tags for immediate on-demand ISR.</p>
          <button type="submit" disabled={isSubmitting} className={buttonStyles({ variant: 'primary', size: 'lg' })}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
            {isSubmitting ? 'Publishing…' : isEdit ? 'Save changes' : 'Publish product'}
          </button>
        </div>
      </div>
    </form>
  );
}
