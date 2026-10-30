import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BatteryFull, Box, CheckCircle2, MapPin, ShieldCheck, Smartphone } from 'lucide-react';
import { ProductGallery } from '@/components/products/ProductGallery';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductJsonLd } from '@/components/seo/ProductJsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { CTASection } from '@/components/content/CTASection';
import { OpenStatusPill } from '@/components/branches/OpenStatusPill';
import { CallLink, WhatsAppLink } from '@/components/analytics/ContactLinks';
import { ReservationForm } from '@/components/forms/ReservationForm';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { buttonStyles } from '@/components/ui/button-styles';
import { getAllProductSlugs, getProductBySlug, getRelatedProducts } from '@/lib/data/catalog';
import { getBranches } from '@/lib/data/content';
import { CATEGORY_OPTIONS } from '@/lib/constants';
import { getPrimaryBranch } from '@/lib/config';
import { buildProductWhatsAppMessage, priceLabel } from '@/lib/utils';
import { buildMetadata } from '@/lib/seo';
import type { Product } from '@/lib/types';

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return buildMetadata({
      title: 'Product not found',
      description: 'This product is not currently listed.',
      path: `/product/${slug}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: `${product.title} in Guwahati`,
    description: product.shortDescription,
    path: `/product/${product.slug}`,
    image: product.images[0]?.url,
  });
}

const branchLabel: Record<Product['branch'], string> = {
  lokhra: 'Lokhra',
  basistha: 'Basistha',
  both: 'Both branches',
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, branches] = await Promise.all([getProductBySlug(slug), getBranches()]);
  if (!product) notFound();
  const [related] = await Promise.all([getRelatedProducts(product, 3)]);
  const category = CATEGORY_OPTIONS.find((item) => item.value === product.category);
  const availableBranches =
    product.branch === 'both' ? branches : branches.filter((branch) => branch.slug === product.branch);
  const primary = getPrimaryBranch();
  const whatsappMessage = buildProductWhatsAppMessage(product);
  const specs = [
    ['RAM', product.specs.ram],
    ['Storage', product.specs.storage],
    ['Colour', product.specs.color],
    ['Display', product.specs.display],
    ['Processor', product.specs.processor],
    ['Camera', product.specs.camera],
    ['Connectivity', product.specs.connectivity],
    ['Battery health', product.batteryHealth],
    ['Warranty', product.warranty],
  ].filter(([, value]) => Boolean(value)) as [string, string][];

  return (
    <>
      <ProductJsonLd product={product} />
      <div className="border-b border-line bg-white">
        <Container className="py-3.5">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: category?.label || 'Products', href: category?.href || '/shop' },
              { label: product.title, href: `/product/${product.slug}` },
            ]}
          />
        </Container>
      </div>

      <section className="bg-cloud py-8 sm:py-12">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <Reveal><ProductGallery images={product.images} title={product.title} /></Reveal>
            <Reveal delay={0.08}>
              <div className="rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-7">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="blue">{product.brand}</Badge>
                  <Badge tone="slate">{category?.label || product.category}</Badge>
                  {product.grade ? <Badge tone="orange">Grade {product.grade}</Badge> : null}
                  <Badge tone={product.status === 'Available' ? 'green' : product.status === 'Reserved' ? 'orange' : 'red'}>
                    {product.status}
                  </Badge>
                </div>
                <h1 className="mt-4 text-3xl font-extrabold leading-tight text-navy sm:text-4xl">{product.title}</h1>
                <p className="mt-3 text-sm leading-6 text-ink">{product.shortDescription}</p>

                <div className="mt-6 rounded-2xl bg-cloud p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-ink">Price</p>
                  <p className="mt-1 text-3xl font-extrabold text-navy">{priceLabel(product)}</p>
                  <p className="mt-1 text-xs text-ink">Final payable amount is confirmed before billing. EMI and delivery eligibility may vary.</p>
                </div>

                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  <WhatsAppLink
                    branchSlug={product.branch === 'basistha' ? 'basistha' : 'lokhra'}
                    message={whatsappMessage}
                    productSlug={product.slug}
                    location="product-page"
                    label="Enquire on WhatsApp"
                    className={buttonStyles({ variant: 'primary' })}
                  />
                  <CallLink
                    branch={primary}
                    location="product-page"
                    label="Call for price / stock"
                    ariaLabel={`Call about ${product.title}`}
                    className={buttonStyles({ variant: 'outline' })}
                  />
                </div>

                <div className="mt-5 flex flex-wrap gap-3 text-sm text-ink">
                  <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />Inspected listing</span>
                  <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-electric" aria-hidden="true" />Warranty details shown</span>
                  <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-orange" aria-hidden="true" />{branchLabel[product.branch]}</span>
                </div>

                <div className="mt-6 border-t border-line pt-5">
                  <h2 className="text-sm font-extrabold uppercase tracking-wide text-navy">Branch availability</h2>
                  <div className="mt-3 grid gap-2">
                    {availableBranches.map((branch) => (
                      <div key={branch.slug} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-cloud px-3 py-2.5">
                        <span className="text-sm font-bold text-navy">{branch.name}</span>
                        <OpenStatusPill branch={branch} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <SectionHeading eyebrow="Full details" title="Specifications & condition" description="Everything we know is listed here. If a detail is missing, ask the team before purchase." />
              <div className="mt-7 overflow-hidden rounded-2xl border border-line">
                <table className="w-full border-collapse bg-white text-left text-sm">
                  <tbody className="divide-y divide-line">
                    <tr><th className="w-1/3 bg-cloud p-4 font-bold text-navy">Condition</th><td className="p-4 text-ink">{product.condition}{product.grade ? ` · Grade ${product.grade}` : ''}</td></tr>
                    <tr><th className="bg-cloud p-4 font-bold text-navy">Availability</th><td className="p-4 text-ink">{product.status} · {branchLabel[product.branch]}</td></tr>
                    {specs.map(([label, value]) => (
                      <tr key={label}><th className="w-1/3 bg-cloud p-4 font-bold text-navy">{label}</th><td className="p-4 text-ink">{value}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-5 rounded-2xl border border-line bg-cloud p-5">
                <h3 className="flex items-center gap-2 text-base font-bold text-navy"><Smartphone className="h-5 w-5 text-electric" aria-hidden="true" />About this device</h3>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-ink">{product.description}</p>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: BatteryFull, label: product.batteryHealth ? `Battery ${product.batteryHealth}` : 'Battery checked' },
                  { icon: ShieldCheck, label: product.warranty || 'Ask about warranty' },
                  { icon: Box, label: 'Branch pickup available' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="rounded-xl border border-line bg-white p-4 text-center">
                    <Icon className="mx-auto h-5 w-5 text-orange" aria-hidden="true" />
                    <p className="mt-2 text-xs font-bold text-navy">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-5">
              <ReservationForm productTitle={product.title} productSlug={product.slug} />
              <EnquiryForm productTitle={product.title} productSlug={product.slug} />
            </div>
          </div>
        </Container>
      </section>

      {related.length ? (
        <section className="bg-cloud py-12 sm:py-16">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow="You may also like" title="Similar live stock" />
              <Link href={category?.href || '/shop'} className={buttonStyles({ variant: 'outline', size: 'sm' })}>View category</Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <Reveal key={item.id} delay={index * 0.06}><ProductCard product={item} /></Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <CTASection title="Still comparing?" description="Tell us your budget and preferred features. We’ll help shortlist the right phone at the right branch." />
    </>
  );
}
