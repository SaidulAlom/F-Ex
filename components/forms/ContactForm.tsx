'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Send } from 'lucide-react';
import { FormField, FormMessage, Honeypot, postLead } from '@/components/forms/FormField';
import { buttonStyles } from '@/components/ui/button-styles';
import { BRANCH_OPTIONS } from '@/lib/constants';
import { trackFormSubmission } from '@/lib/analytics';
import { contactSchema } from '@/lib/validators';

export function ContactForm() {
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      type: 'contact' as const,
      name: '',
      phone: '',
      email: '',
      branch: 'both' as const,
      message: '',
      companyWebsite: '',
      source: 'contact-page',
    },
  });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        setSuccess('');
        setServerError('');
        try {
          const result = await postLead(values);
          trackFormSubmission('contact', { lead_type: 'contact', branch: values.branch });
          setSuccess(result.message);
          reset();
        } catch (error) {
          setServerError(error instanceof Error ? error.message : 'Unable to send your enquiry.');
        }
      })}
      className="relative space-y-4 rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6"
      noValidate
    >
      <input type="hidden" {...register('type')} />
      <input type="hidden" {...register('source')} />
      <Honeypot register={register} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Your name" htmlFor="contact-name" required error={errors.name?.message}>
          <input id="contact-name" className="admin-input" autoComplete="name" {...register('name')} />
        </FormField>
        <FormField label="Phone number" htmlFor="contact-phone" required error={errors.phone?.message}>
          <input id="contact-phone" type="tel" className="admin-input" autoComplete="tel" {...register('phone')} />
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Email (optional)" htmlFor="contact-email" error={errors.email?.message}>
          <input id="contact-email" type="email" className="admin-input" autoComplete="email" {...register('email')} />
        </FormField>
        <FormField label="Preferred branch" htmlFor="contact-branch" error={errors.branch?.message}>
          <select id="contact-branch" className="admin-input" {...register('branch')}>
            <option value="both">No preference</option>
            {BRANCH_OPTIONS.filter((option) => option.value !== 'both').map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </FormField>
      </div>
      <FormField label="How can we help?" htmlFor="contact-message" required error={errors.message?.message}>
        <textarea id="contact-message" rows={5} className="admin-input resize-y" placeholder="Tell us the model, repair, or product you’re looking for…" {...register('message')} />
      </FormField>
      <FormMessage success={success} error={serverError || errors.companyWebsite?.message} />
      <button type="submit" disabled={isSubmitting} className={buttonStyles({ variant: 'primary', className: 'w-full' })}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
        {isSubmitting ? 'Sending…' : 'Send enquiry'}
      </button>
      <p className="text-center text-xs text-ink">
        We normally reply during branch hours. Your details are used only to answer your enquiry.
      </p>
    </form>
  );
}
