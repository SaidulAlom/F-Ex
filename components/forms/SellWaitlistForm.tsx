'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { BellRing, Loader2 } from 'lucide-react';
import { FormField, FormMessage, Honeypot, postLead } from '@/components/forms/FormField';
import { buttonStyles } from '@/components/ui/button-styles';
import { BRANCH_OPTIONS } from '@/lib/constants';
import { trackFormSubmission } from '@/lib/analytics';
import { sellSchema } from '@/lib/validators';

export function SellWaitlistForm() {
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(sellSchema),
    defaultValues: {
      type: 'sell' as const,
      name: '',
      phone: '',
      email: '',
      deviceDetails: '',
      expectedPrice: '',
      branch: 'both' as const,
      companyWebsite: '',
      source: 'sell-exchange-coming-soon',
    },
  });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        setSuccess('');
        setServerError('');
        try {
          const result = await postLead(values);
          trackFormSubmission('sell_waitlist', { lead_type: 'sell', branch: values.branch });
          setSuccess(result.message);
          reset();
        } catch (error) {
          setServerError(error instanceof Error ? error.message : 'Unable to join the waitlist.');
        }
      })}
      className="relative space-y-4 rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6"
      noValidate
    >
      <div className="flex items-start gap-3">
        <span className="rounded-xl bg-electric/10 p-2.5 text-electric">
          <BellRing className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-navy">Join the Phase 2 waitlist</h2>
          <p className="mt-0.5 text-xs text-ink">Tell us what you’d like to sell or exchange. We’ll notify you when online valuation opens.</p>
        </div>
      </div>
      <input type="hidden" {...register('type')} />
      <input type="hidden" {...register('source')} />
      <Honeypot register={register} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Your name" htmlFor="sell-name" required error={errors.name?.message}>
          <input id="sell-name" className="admin-input" autoComplete="name" {...register('name')} />
        </FormField>
        <FormField label="Phone number" htmlFor="sell-phone" required error={errors.phone?.message}>
          <input id="sell-phone" type="tel" className="admin-input" autoComplete="tel" {...register('phone')} />
        </FormField>
      </div>
      <FormField label="Device details" htmlFor="sell-device" required error={errors.deviceDetails?.message}>
        <textarea id="sell-device" rows={3} className="admin-input resize-y" placeholder="Brand, model, storage, age and condition…" {...register('deviceDetails')} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Expected price (optional)" htmlFor="sell-price" error={errors.expectedPrice?.message}>
          <input id="sell-price" className="admin-input" placeholder="₹ or “need a quote”" {...register('expectedPrice')} />
        </FormField>
        <FormField label="Nearest branch" htmlFor="sell-branch" error={errors.branch?.message}>
          <select id="sell-branch" className="admin-input" {...register('branch')}>
            <option value="both">No preference</option>
            {BRANCH_OPTIONS.filter((option) => option.value !== 'both').map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </FormField>
      </div>
      <FormField label="Email (optional)" htmlFor="sell-email" error={errors.email?.message}>
        <input id="sell-email" type="email" className="admin-input" autoComplete="email" {...register('email')} />
      </FormField>
      <FormMessage success={success} error={serverError || errors.companyWebsite?.message} />
      <button type="submit" disabled={isSubmitting} className={buttonStyles({ variant: 'primary', className: 'w-full' })}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <BellRing className="h-4 w-4" aria-hidden="true" />}
        {isSubmitting ? 'Joining…' : 'Notify me when it launches'}
      </button>
    </form>
  );
}
