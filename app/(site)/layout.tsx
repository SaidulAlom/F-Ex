import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { MobileCallBar } from '@/components/layout/MobileCallBar';
import { PageTransition } from '@/components/motion/PageTransition';
import { LocalBusinessJsonLd } from '@/components/seo/LocalBusinessJsonLd';
import { getBranches } from '@/lib/data/content';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const branches = await getBranches();
  return (
    <>
      <LocalBusinessJsonLd branches={branches} />
      <SiteHeader />
      <main id="content" className="min-h-[60vh]">
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter branches={branches} />
      <MobileCallBar />
    </>
  );
}
