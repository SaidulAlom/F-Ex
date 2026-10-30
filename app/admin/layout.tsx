import type { Metadata } from 'next';
import { SessionProvider } from '@/components/providers/SessionProvider';

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | F-Ex Store Admin' },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
