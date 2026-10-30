import { buildMetadata } from '@/lib/seo';
import { getBranches, getActiveBanners, getApprovedTestimonials } from '@/lib/data/content';
import { getFeaturedProducts } from '@/lib/data/catalog';
import { sampleBanners } from '@/lib/seed-data';
import { HOME_FAQ } from '@/lib/constants';
import { LazyBrandMarquee, LazyHero, LazyRepairProcess } from '@/components/motion/LazyMotionSections';
import { Reveal } from '@/components/motion/Reveal';
import { TrustStrip } from '@/components/home/TrustStrip';
import { CategoryTiles } from '@/components/home/CategoryTiles';
import { OfferGrid } from '@/components/home/OfferGrid';
import { LiveStockSection } from '@/components/home/LiveStockSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { BranchCards } from '@/components/branches/BranchCards';
import { FAQ } from '@/components/content/FAQ';
import { CTASection } from '@/components/content/CTASection';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const revalidate = 300;

export const metadata = buildMetadata({
  title: 'Mobile Phones, Repairs & Accessories in Guwahati',
  description:
    'F-Ex Store is a mobile phone dealership in Lokhra and Basistha, Guwahati. Shop new and second-hand phones, accessories, gadgets, repairs, EMI and same-day delivery. Open daily till 10 PM.',
  path: '/',
});

export default async function HomePage() {
  const [heroBanners, offers, featured, testimonials, branches] = await Promise.all([
    getActiveBanners('hero'),
    getActiveBanners('offer'),
    getFeaturedProducts(6),
    getApprovedTestimonials(),
    getBranches(),
  ]);
  const hero = heroBanners[0] || sampleBanners.find((banner) => banner.type === 'hero')!;
  const activeOffers = offers.length
    ? offers
    : sampleBanners.filter((banner) => banner.type === 'offer').slice(0, 3);

  return (
    <>
      <LazyHero banner={hero} branches={branches} />
      <TrustStrip />
      <CategoryTiles />
      <OfferGrid banners={activeOffers} />
      <LiveStockSection products={featured} />
      <LazyBrandMarquee />

      <section className="bg-white py-14 sm:py-18">
        <div className="container-content grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="Local & dependable"
              title="A mobile shop built around clear information."
              description="Whether you search for a mobile shop in Lokhra, Basistha or anywhere in Guwahati, you should know what you’re buying before you travel."
            />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ['Clear grades', 'A/B/C cosmetic grades, battery health and warranty shown on pre-owned devices.'],
                ['Live status', 'Available, Reserved and Sold badges keep stock expectations honest.'],
                ['Easy payment', 'Cash, UPI, cards and EMI options in-store.'],
                ['Late hours', 'Both branches are open daily until 10 PM IST.'],
              ].map(([title, description]) => (
                <div key={title} className="rounded-2xl border border-line bg-cloud p-4">
                  <h3 className="text-sm font-extrabold text-navy">{title}</h3>
                  <p className="mt-1.5 text-xs leading-5 text-ink">{description}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-line bg-cloud p-5 shadow-soft">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-navy p-6 text-white">
                  <p className="text-4xl font-extrabold text-orange">2</p>
                  <p className="mt-2 text-sm font-bold">Guwahati branches</p>
                  <p className="mt-1 text-xs text-blue-100">Lokhra & Basistha</p>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <p className="text-4xl font-extrabold text-electric">10 PM</p>
                  <p className="mt-2 text-sm font-bold text-navy">Daily closing</p>
                  <p className="mt-1 text-xs text-ink">Calculated in IST</p>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <p className="text-4xl font-extrabold text-orange">2024</p>
                  <p className="mt-2 text-sm font-bold text-navy">Established</p>
                  <p className="mt-1 text-xs text-ink">Serving Guwahati</p>
                </div>
                <div className="rounded-2xl bg-electric p-6 text-white">
                  <p className="text-4xl font-extrabold">5★</p>
                  <p className="mt-2 text-sm font-bold">Customer-first help</p>
                  <p className="mt-1 text-xs text-blue-100">Curated reviews</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <LazyRepairProcess />
      <TestimonialsSection testimonials={testimonials} />

      <section className="bg-cloud py-14 sm:py-18" aria-labelledby="branches-heading">
        <div className="container-content">
          <Reveal>
            <div id="branches-heading">
              <SectionHeading
                eyebrow="Two convenient branches"
                title="Find us in Lokhra or Basistha."
                description="Check live open/closed status in IST, get directions, click to call, or message the branch on WhatsApp."
              />
            </div>
          </Reveal>
          <div className="mt-9">
            <BranchCards branches={branches} />
          </div>
        </div>
      </section>

      <FAQ items={HOME_FAQ} />
      <CTASection />
    </>
  );
}
