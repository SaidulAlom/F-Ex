import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { cn } from '@/lib/utils';

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumbs: { label: string; href: string }[];
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <>
      <div className="border-b border-line bg-white">
        <Container className="py-3.5">
          <Breadcrumbs items={breadcrumbs} />
        </Container>
      </div>
      <section className={cn('relative overflow-hidden gradient-mesh text-white', className)}>
        <div className="hero-orb hero-orb-a -right-16 -top-28 h-72 w-72 bg-electric/40" />
        <Container className="relative py-14 sm:py-18">
          <div className="max-w-3xl">
            <Badge tone="white" className="mb-4">{eyebrow}</Badge>
            <h1 className="text-4xl font-extrabold leading-[1.08] sm:text-5xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">{description}</p>
            {children ? <div className="mt-7">{children}</div> : null}
          </div>
        </Container>
      </section>
    </>
  );
}
