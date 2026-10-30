'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CalendarClock, Loader2 } from 'lucide-react';
import { FormField, FormMessage, Honeypot, postLead } from '@/components/forms/FormField';
import { buttonStyles } from '@/components/ui/button-styles';
import { BRANCH_OPTIONS } from '@/lib/constants';
import { trackFormSubmission } from '@/lib/analytics';
import { toDateTimeLocalValue } from '@/lib/utils';
import { reservationSchema } from '@/lib/validators';

export function ReservationForm({
  productTitle,
  productSlug,
}: {
  productTitle: string;
  productSlug: string;
}) {
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');
  const minimumTime = toDateTimeLocalValue(new Date());
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      type: 'reservation' as const,
      name: '',
      phone: '',
      email: '',
      branch: 'lokhra' as const,
      pickupTime: '',
      productTitle,
      productSlug,
      message: '',
      companyWebsite: '',
      source: 'product-page',
    },
  });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        setSuccess('');
        setServerError('');
        try {
          const result = await postLead(values);
          trackFormSubmission('reservation', {
            lead_type: 'reservation',
            branch: values.branch,
            product: productSlug,
          });
          setSuccess(result.message);
          reset({ ...values, name: '', phone: '', email: '', pickupTime: '', message: '' });
        } catch (error) {
          setServerError(error instanceof Error ? error.message : 'Unable to reserve this phone.');
        }
      })}
      className="relative space-y-4 rounded-2xl border border-line bg-white p-5 shadow-soft"
      noValidate
    >
      <div className="flex items-start gap-3 border-b border-line pb-4">
        <span className="rounded-xl bg-electric/10 p-2.5 text-electric">
          <CalendarClock className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-navy">Reserve this phone</h2>
          <p className="mt-0.5 text-xs leading-5 text-ink">Choose a branch and pickup time. We’ll call to confirm stock.</p>
        </div>
      </div>
      <input type="hidden" {...register('type')} />
      <input type="hidden" {...register('source')} />
      <input type="hidden" {...register('productTitle')} />
      <input type="hidden" {...register('productSlug')} />
      <Honeypot register={register} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Your name" htmlFor="reserve-name" required error={errors.name?.message}>
          <input id="reserve-name" className="admin-input" autoComplete="name" {...register('name')} />
        </FormField>
        <FormField label="Phone number" htmlFor="reserve-phone" required error={errors.phone?.message}>
          <input id="reserve-phone" type="tel" className="admin-input" autoComplete="tel" {...register('phone')} />
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Preferred branch" htmlFor="reserve-branch" required error={errors.branch?.message}>
          <select id="reserve-branch" className="admin-input" {...register('branch')}>
            {BRANCH_OPTIONS.filter((option) => option.value !== 'both').map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Pickup time" htmlFor="reserve-time" required error={errors.pickupTime?.message}>
          <input id="reserve-time" type="datetime-local" min={minimumTime} className="admin-input" {...register('pickupTime')} />
        </FormField>
      </div>
      <FormField label="Email (optional)" htmlFor="reserve-email" error={errors.email?.message}>
        <input id="reserve-email" type="email" className="admin-input" autoComplete="email" {...register('email')} />
      </FormField>
      <FormField label="Notes (optional)" htmlFor="reserve-message" error={errors.message?.message}>
        <textarea id="reserve-message" rows={2} className="admin-input resize-y" placeholder="Colour preference, exchange question, etc." {...register('message')} />
      </FormField>
      <FormMessage success={success} error={serverError || errors.companyWebsite?.message} />
      <button type="submit" disabled={isSubmitting} className={buttonStyles({ variant: 'orange', className: 'w-full' })}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {isSubmitting ? 'Sending request…' : 'Request reservation'}
      </button>
    </form>
  );
}
