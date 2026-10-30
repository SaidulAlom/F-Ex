'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { HelpCircle, Loader2 } from 'lucide-react';
import { FormField, FormMessage, Honeypot, postLead } from '@/components/forms/FormField';
import { buttonStyles } from '@/components/ui/button-styles';
import { BRANCH_OPTIONS } from '@/lib/constants';
import { trackFormSubmission } from '@/lib/analytics';
import { enquirySchema } from '@/lib/validators';

export function EnquiryForm({
  productTitle,
  productSlug,
}: {
  productTitle: string;
  productSlug: string;
}) {
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      type: 'enquiry' as const,
      name: '',
      phone: '',
      email: '',
      branch: 'both' as const,
      message: `I have a question about ${productTitle}.`,
      productTitle,
      productSlug,
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
          trackFormSubmission('product_enquiry', {
            lead_type: 'enquiry',
            branch: values.branch,
            product: productSlug,
          });
          setSuccess(result.message);
          reset();
        } catch (error) {
          setServerError(error instanceof Error ? error.message : 'Unable to send your question.');
        }
      })}
      className="relative space-y-3 rounded-2xl border border-line bg-white p-5 shadow-soft"
      noValidate
    >
      <h2 className="flex items-center gap-2 text-lg font-bold text-navy">
        <HelpCircle className="h-5 w-5 text-electric" aria-hidden="true" />
        Ask about this phone
      </h2>
      <input type="hidden" {...register('type')} />
      <input type="hidden" {...register('source')} />
      <input type="hidden" {...register('productTitle')} />
      <input type="hidden" {...register('productSlug')} />
      <Honeypot register={register} />
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label="Name" htmlFor="enquiry-name" required error={errors.name?.message}>
          <input id="enquiry-name" className="admin-input" autoComplete="name" {...register('name')} />
        </FormField>
        <FormField label="Phone" htmlFor="enquiry-phone" required error={errors.phone?.message}>
          <input id="enquiry-phone" type="tel" className="admin-input" autoComplete="tel" {...register('phone')} />
        </FormField>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label="Branch" htmlFor="enquiry-branch" error={errors.branch?.message}>
          <select id="enquiry-branch" className="admin-input" {...register('branch')}>
            <option value="both">No preference</option>
            {BRANCH_OPTIONS.filter((option) => option.value !== 'both').map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Email (optional)" htmlFor="enquiry-email" error={errors.email?.message}>
          <input id="enquiry-email" type="email" className="admin-input" autoComplete="email" {...register('email')} />
        </FormField>
      </div>
      <FormField label="Your question" htmlFor="enquiry-message" required error={errors.message?.message}>
        <textarea id="enquiry-message" rows={3} className="admin-input resize-y" {...register('message')} />
      </FormField>
      <FormMessage success={success} error={serverError || errors.companyWebsite?.message} />
      <button type="submit" disabled={isSubmitting} className={buttonStyles({ variant: 'outline', className: 'w-full' })}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {isSubmitting ? 'Sending…' : 'Send quick enquiry'}
      </button>
    </form>
  );
}
