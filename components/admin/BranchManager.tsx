'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Clock3, MapPin, Phone } from 'lucide-react';
import { FormField, FormMessage } from '@/components/forms/FormField';
import { buttonStyles } from '@/components/ui/button-styles';
import { Badge } from '@/components/ui/Badge';
import { OpenStatusPill } from '@/components/branches/OpenStatusPill';
import { adminFetch } from '@/components/admin/admin-api-client';
import { trackFormSubmission } from '@/lib/analytics';
import { branchUpdateSchema } from '@/lib/validators';
import type { AdminRole, Branch } from '@/lib/types';

function valuesFor(branch: Branch) {
  return {
    slug: branch.slug,
    phone: branch.phone,
    address: branch.address,
    hours: [
      {
        label: branch.hours[0]?.label || 'Monday – Sunday',
        days: branch.hours[0]?.days || [0, 1, 2, 3, 4, 5, 6],
        open: branch.hours[0]?.open || '10:00',
        close: branch.hours[0]?.close || '22:00',
      },
    ],
  };
}

export function BranchManager({
  branches: initialBranches,
  userRole,
}: {
  branches: Branch[];
  userRole: AdminRole;
}) {
  const router = useRouter();
  const [branches, setBranches] = useState(initialBranches);
  const [selected, setSelected] = useState<Branch['slug']>(initialBranches[0]?.slug || 'lokhra');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(branchUpdateSchema), defaultValues: valuesFor(initialBranches[0]) });

  useEffect(() => {
    const branch = branches.find((item) => item.slug === selected);
    if (branch) reset(valuesFor(branch));
  }, [branches, reset, selected]);

  if (userRole !== 'Owner') {
    return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-semibold text-amber-900">Owner access is required to edit branch details.</div>;
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-navy">Branches</h2>
        <div className="mt-4 space-y-3">
          {branches.map((branch) => (
            <button
              key={branch.slug}
              type="button"
              onClick={() => setSelected(branch.slug)}
              className={`w-full rounded-xl border p-4 text-left ${selected === branch.slug ? 'border-electric bg-electric/5' : 'border-line bg-cloud'}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-navy">{branch.name}</span>
                <OpenStatusPill branch={branch} />
              </div>
              <p className="mt-2 text-xs leading-5 text-ink">{branch.address}</p>
              <p className="mt-1 text-xs font-semibold text-electric">{branch.hours[0]?.open}–{branch.hours[0]?.close} IST</p>
            </button>
          ))}
        </div>
        <div className="mt-5 rounded-xl bg-cloud p-4 text-xs leading-5 text-ink">
          <p className="font-bold text-navy">Where data lives</p>
          <p className="mt-1">Base branch data, WhatsApp numbers, maps and social links are in <code>lib/config.ts</code>. These admin edits override phone, address and hours in MongoDB.</p>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-navy">Edit {selected} branch</h2>
          <Badge tone="blue">IST</Badge>
        </div>
        <form
          onSubmit={handleSubmit(async (values) => {
            setSuccess('');
            setError('');
            const payload = {
              ...values,
              hours: [{ ...values.hours[0], days: [0, 1, 2, 3, 4, 5, 6] }],
            };
            const parsed = branchUpdateSchema.safeParse(payload);
            if (!parsed.success) {
              setError(parsed.error.issues.map((issue) => issue.message).join(' '));
              return;
            }
            try {
              const data = await adminFetch<{ branch: Branch }>('/api/admin/branches', {
                method: 'PUT',
                body: JSON.stringify(parsed.data),
              });
              setBranches((items) => items.map((item) => item.slug === data.branch.slug ? data.branch : item));
              trackFormSubmission('admin_branch', { branch: data.branch.slug });
              setSuccess('Branch details saved. Public pages were revalidated.');
              router.refresh();
            } catch (caught) {
              setError(caught instanceof Error ? caught.message : 'Could not save branch.');
            }
          })}
          className="mt-4 space-y-4"
          noValidate
        >
          <input type="hidden" {...register('slug')} />
          <FormField label="Phone number" htmlFor="branch-phone" required error={errors.phone?.message}>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input id="branch-phone" className="admin-input pl-9" placeholder="+91-8511822537" {...register('phone')} />
            </div>
          </FormField>
          <FormField label="Full address" htmlFor="branch-address" required error={errors.address?.message}>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" aria-hidden="true" />
              <textarea id="branch-address" rows={3} className="admin-input resize-y pl-9" {...register('address')} />
            </div>
          </FormField>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Days label" htmlFor="branch-hours-label" error={errors.hours?.[0]?.label?.message}>
              <input id="branch-hours-label" className="admin-input" {...register('hours.0.label')} />
            </FormField>
            <FormField label="Opens (HH:MM)" htmlFor="branch-open" error={errors.hours?.[0]?.open?.message}>
              <input id="branch-open" className="admin-input" placeholder="10:00" {...register('hours.0.open')} />
            </FormField>
            <FormField label="Closes (HH:MM)" htmlFor="branch-close" error={errors.hours?.[0]?.close?.message}>
              <input id="branch-close" className="admin-input" placeholder="22:00" {...register('hours.0.close')} />
            </FormField>
          </div>
          <div className="flex items-start gap-2 rounded-xl bg-cloud p-3 text-xs text-ink">
            <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-electric" aria-hidden="true" />
            Open/closed pills across the website use this schedule in the Asia/Kolkata timezone.
          </div>
          {errors.hours?.message ? <p className="form-error">{String(errors.hours.message)}</p> : null}
          <FormMessage success={success} error={error} />
          <button type="submit" disabled={isSubmitting} className={buttonStyles({ variant: 'primary' })}>{isSubmitting ? 'Saving…' : 'Save branch details'}</button>
        </form>
      </section>
    </div>
  );
}
