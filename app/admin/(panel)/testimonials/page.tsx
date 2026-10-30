import { redirect } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { TestimonialManager } from '@/components/admin/TestimonialManager';
import { getAdminUser } from '@/lib/api-auth';
import { getAllTestimonials } from '@/lib/data/content';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Testimonials' };

export default async function AdminTestimonialsPage() {
  const user = await getAdminUser();
  if (!user) redirect('/admin/login');
  if (user.role !== 'Owner') redirect('/admin?error=owner-only');
  const testimonials = await getAllTestimonials();
  return (
    <>
      <AdminPageHeader eyebrow="Social proof" title="Curated testimonials" description="Approve customer stories for the public testimonials section. Unapproved reviews remain admin-only." />
      <TestimonialManager testimonials={testimonials} />
    </>
  );
}
