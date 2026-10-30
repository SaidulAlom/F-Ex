'use client';

import { useId } from 'react';
import type { UseFormRegister } from 'react-hook-form';
import { cn } from '@/lib/utils';

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(className)}>
      <label htmlFor={htmlFor} className="form-label">
        {label}
        {required ? <span className="ml-0.5 text-orange">*</span> : null}
      </label>
      {children}
      {hint && !error ? <p className="mt-1 text-xs text-ink">{hint}</p> : null}
      {error ? <p className="form-error">{error}</p> : null}
    </div>
  );
}

export function FormMessage({
  success,
  error,
}: {
  success?: string;
  error?: string;
}) {
  if (!success && !error) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'rounded-xl border px-4 py-3 text-sm font-semibold',
        success
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : 'border-red-200 bg-red-50 text-red-700',
      )}
    >
      {success || error}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Honeypot({ register }: { register: UseFormRegister<any> }) {
  const id = useId();
  return (
    <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
      <label htmlFor={id}>Leave this field empty</label>
      <input
        id={id}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        {...register('companyWebsite')}
      />
    </div>
  );
}

export async function postLead<T>(values: T): Promise<{ message: string }> {
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });
  const data = (await response.json().catch(() => ({}))) as {
    ok?: boolean;
    message?: string;
    details?: string[];
  };
  if (!response.ok || !data.ok) {
    const detail = data.details?.length ? ` ${data.details.join(' ')}` : '';
    throw new Error(`${data.message || 'We could not send your request.'}${detail}`);
  }
  return { message: data.message || 'Thank you — our team will contact you shortly.' };
}
