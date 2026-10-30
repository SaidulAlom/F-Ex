'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { Loader2, Wrench, X } from 'lucide-react';
import { CloudinaryUploader } from '@/components/forms/CloudinaryUploader';
import { FormField, FormMessage, Honeypot, postLead } from '@/components/forms/FormField';
import { SmartImage } from '@/components/ui/SmartImage';
import { buttonStyles } from '@/components/ui/button-styles';
import { BRANCH_OPTIONS, REPAIR_ISSUE_TYPES } from '@/lib/constants';
import { trackFormSubmission } from '@/lib/analytics';
import { repairSchema } from '@/lib/validators';

export function RepairForm() {
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(repairSchema),
    defaultValues: {
      type: 'repair' as const,
      name: '',
      phone: '',
      email: '',
      brand: '',
      model: '',
      issueType: 'Screen / display' as const,
      description: '',
      branch: 'lokhra' as const,
      photoUrl: '',
      companyWebsite: '',
      source: 'repair-page',
    },
  });
  const photoUrl = useWatch({ control, name: 'photoUrl' });

  return (
    <form
      id="repair-request"
      onSubmit={handleSubmit(async (values) => {
        setSuccess('');
        setServerError('');
        try {
          const result = await postLead(values);
          trackFormSubmission('repair_request', {
            lead_type: 'repair',
            branch: values.branch,
            issue_type: values.issueType,
          });
          setSuccess(result.message);
          reset();
        } catch (error) {
          setServerError(error instanceof Error ? error.message : 'Unable to send your repair request.');
        }
      })}
      className="relative space-y-4 rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6"
      noValidate
    >
      <div className="flex items-start gap-3 border-b border-line pb-4">
        <span className="rounded-xl bg-orange/10 p-2.5 text-orange">
          <Wrench className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-navy">Request a repair</h2>
          <p className="mt-0.5 text-xs leading-5 text-ink">Tell us the problem. We’ll diagnose it and call with an estimate before work begins.</p>
        </div>
      </div>
      <input type="hidden" {...register('type')} />
      <input type="hidden" {...register('source')} />
      <input type="hidden" {...register('photoUrl')} />
      <Honeypot register={register} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Phone brand" htmlFor="repair-brand" required error={errors.brand?.message}>
          <input id="repair-brand" className="admin-input" placeholder="Apple, Vivo, Samsung…" {...register('brand')} />
        </FormField>
        <FormField label="Model" htmlFor="repair-model" required error={errors.model?.message}>
          <input id="repair-model" className="admin-input" placeholder="iPhone 13, V50 5G…" {...register('model')} />
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Issue type" htmlFor="repair-issue" required error={errors.issueType?.message}>
          <select id="repair-issue" className="admin-input" {...register('issueType')}>
            {REPAIR_ISSUE_TYPES.map((issue) => (
              <option key={issue} value={issue}>{issue}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Preferred branch" htmlFor="repair-branch" required error={errors.branch?.message}>
          <select id="repair-branch" className="admin-input" {...register('branch')}>
            {BRANCH_OPTIONS.filter((option) => option.value !== 'both').map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </FormField>
      </div>
      <FormField label="Describe the issue" htmlFor="repair-description" required error={errors.description?.message}>
        <textarea id="repair-description" rows={4} className="admin-input resize-y" placeholder="When did it start? Is there physical or liquid damage?" {...register('description')} />
      </FormField>
      <FormField label="Your name" htmlFor="repair-name" required error={errors.name?.message}>
        <input id="repair-name" className="admin-input" autoComplete="name" {...register('name')} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Phone number" htmlFor="repair-phone" required error={errors.phone?.message}>
          <input id="repair-phone" type="tel" className="admin-input" autoComplete="tel" {...register('phone')} />
        </FormField>
        <FormField label="Email (optional)" htmlFor="repair-email" error={errors.email?.message}>
          <input id="repair-email" type="email" className="admin-input" autoComplete="email" {...register('email')} />
        </FormField>
      </div>
      <div>
        <CloudinaryUploader
          context="repair"
          maxFiles={1}
          compact
          label="Add a photo of the damage (optional)"
          onUploaded={(images) => setValue('photoUrl', images[0]?.url || '', { shouldValidate: true })}
        />
        {photoUrl ? (
          <div className="mt-3 flex items-center gap-3 rounded-xl border border-line bg-cloud p-3">
            <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-white">
              <SmartImage src={photoUrl} alt="Uploaded repair issue" fill sizes="64px" className="object-cover" />
            </div>
            <span className="flex-1 text-xs font-semibold text-emerald-700">Photo attached to your request.</span>
            <button type="button" onClick={() => setValue('photoUrl', '')} className="rounded-lg p-2 text-ink hover:bg-white" aria-label="Remove photo">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : null}
        {errors.photoUrl?.message ? <p className="form-error">{errors.photoUrl.message}</p> : null}
      </div>
      <FormMessage success={success} error={serverError || errors.companyWebsite?.message} />
      <button type="submit" disabled={isSubmitting} className={buttonStyles({ variant: 'orange', className: 'w-full' })}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Wrench className="h-4 w-4" aria-hidden="true" />}
        {isSubmitting ? 'Sending…' : 'Submit repair request'}
      </button>
    </form>
  );
}
