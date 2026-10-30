'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, LockKeyhole } from 'lucide-react';
import { FormField, FormMessage } from '@/components/forms/FormField';
import { buttonStyles } from '@/components/ui/button-styles';
import { trackFormSubmission } from '@/lib/analytics';
import { loginSchema } from '@/lib/validators';

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const requested = searchParams.get('callbackUrl') || '/admin';
  const callbackUrl = requested.startsWith('/') && !requested.startsWith('//') ? requested : '/admin';

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        setError('');
        const result = await signIn('credentials', {
          email: values.email,
          password: values.password,
          redirect: false,
        });
        if (!result || result.error || !result.ok) {
          setError('Email or password is incorrect.');
          return;
        }
        trackFormSubmission('admin_login', { lead_type: 'admin' });
        router.push(callbackUrl);
        router.refresh();
      })}
      className="space-y-4 rounded-2xl border border-white/10 bg-white p-6 shadow-card"
      noValidate
    >
      <div className="flex items-center gap-3 border-b border-line pb-4">
        <span className="rounded-xl bg-electric/10 p-2.5 text-electric"><LockKeyhole className="h-5 w-5" aria-hidden="true" /></span>
        <div>
          <h2 className="text-lg font-bold text-navy">Sign in</h2>
          <p className="text-xs text-ink">Owner and branch staff access only.</p>
        </div>
      </div>
      <FormField label="Email" htmlFor="admin-email" required error={errors.email?.message}>
        <input id="admin-email" type="email" className="admin-input" autoComplete="username" {...register('email')} />
      </FormField>
      <FormField label="Password" htmlFor="admin-password" required error={errors.password?.message}>
        <input id="admin-password" type="password" className="admin-input" autoComplete="current-password" {...register('password')} />
      </FormField>
      <FormMessage error={error} />
      <button type="submit" disabled={isSubmitting} className={buttonStyles({ variant: 'primary', className: 'w-full' })}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <LockKeyhole className="h-4 w-4" aria-hidden="true" />}
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </button>
      <p className="text-center text-xs text-ink">Use the seeded Owner account or a BranchStaff account created with npm run seed:staff.</p>
    </form>
  );
}
