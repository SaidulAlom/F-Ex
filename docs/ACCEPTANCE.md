# Requirements coverage

This document maps the brief to concrete files. It is a verification aid; the code itself is the source of truth.

## Business & content

| Requirement | Implementation |
|---|---|
| New phones, second-hand phones, accessories, gadgets, landline phones | `lib/seed-data.ts`, `lib/constants.ts`, catalogue filters, `models/Product.ts` |
| Screen, motherboard, speaker/camera, fingerprint and battery repairs | `app/(site)/repair/page.tsx`, `lib/constants.ts`, `RepairForm` |
| Open daily until 10 PM, established 2024 | `lib/config.ts`, `lib/branch-hours.ts`, `OpenStatusPill`, home/about/footer |
| Pickup, same-day and free delivery | `app/(site)/delivery-pickup/page.tsx`, `PageHero`, FAQ |
| Cash, Paytm/PhonePe UPI, Visa/MasterCard/RuPay, EMI | `lib/constants.ts`, `PaymentBadges`, `app/(site)/emi-payments/page.tsx` |
| Branch data, WhatsApp numbers, social links in one config | `lib/config.ts` with TODO placeholders; `BranchManager` only overrides phone/address/hours |
| Lokhra and Basistha branches | `/branches/lokhra`, `/branches/basistha`, branch cards, maps, LocalBusiness JSON-LD |

## Public routes

All implemented under `app/(site)/`: `/`, `/new-phones`, `/second-hand-phones`, `/accessories`, `/repair`, `/emi-payments`, `/delivery-pickup`, `/branches`, `/branches/[slug]`, `/about`, `/contact`, `/product/[slug]`, `/sell-exchange` coming soon, plus `/shop` as the unified catalogue.

## Catalogue & product features

| Requirement | Implementation |
|---|---|
| Database-editable hero banners/offers | `models/Banner.ts`, `getActiveBanners`, `BannerManager`, active date filtering |
| URL-synced category/brand/price/condition/availability filters | `ProductExplorer`, `lib/query.ts`, `useUrlFilters`, `parseProductQuery` |
| Pagination | `ProductExplorer` and `getProducts` with `page`, `pages`, `limit` |
| Swipeable/zoom product gallery | `ProductGallery` with snap scrolling, thumbnail nav and click zoom |
| Price or Call for price | `ProductCard`, `ProductForm`, `ProductJsonLd`, product detail |
| Specs, grade, battery, warranty, branch availability | product detail table and card quick views |
| Debounced live search by model/brand | `SearchBox`, `useDebounce`, `/api/search`, product/brand suggestions |
| Visible Sold/Reserved badges | `ProductCard` ribbons, product detail status, admin status dropdown |
| Per-product prefilled WhatsApp enquiry | `buildProductWhatsAppMessage`, `WhatsAppLink` in card/detail/quick-view |
| Reservation form | `ReservationForm` → `/api/leads` → `LeadModel` → Resend |
| Repair form with optional Cloudinary photo | `RepairForm`, `CloudinaryUploader`, signed upload API |
| Honeypot + rate-limited contact form + confirmation | `ContactForm`, `/api/leads`, `leadInputSchema`, `rate-limit.ts`, `FormMessage` |
| Curated testimonials + Google reviews link | `TestimonialManager`, `TestimonialsSection`, config social link |
| GA4 call/WhatsApp/directions/form events | `ContactLinks`, `TrackableLink`, `GoogleAnalytics`, all form components |

## Admin

| Requirement | Implementation |
|---|---|
| `/admin` protected | `proxy.ts`, `app/admin/(panel)/layout.tsx`, `getAdminUser`, API role checks |
| NextAuth credentials, bcrypt, Owner/BranchStaff branch scope | `lib/auth.ts`, `models/User.ts`, scripts, `lib/permissions.ts`, admin APIs |
| Product CRUD, multi-image upload, status | `ProductForm`, `AdminProductTable`, `CloudinaryUploader`, product APIs |
| Banners/offers/featured with active dates | `BannerManager`, `FeaturedProductsManager`, banner APIs |
| Leads table, search/filter/status, Resend on new lead | `LeadsTable`, `/api/leads`, `sendLeadNotification` |
| Branch detail editor | `BranchManager`, `/api/admin/branches` |
| CSV export | `/api/admin/leads/export/route.ts`, `toCsv` |
| Fast stock workflow + on-demand ISR | inline status dropdown, `revalidatePublicContent`, cache tags |

## Models

All six required models exist in `models/`: `Product`, `Branch`, `Lead`, `Banner`, `Testimonial`, `User`.

## Non-functional

- Next.js App Router, TypeScript strict, Tailwind CSS 4, Framer Motion, MongoDB/Mongoose, Cloudinary, NextAuth, Zod/RHF, Resend, Vercel-ready.
- Mobile-first design, server components by default, `next/image`, `next/font`, lazy-loaded heavy animation components.
- Metadata, OG, JSON-LD, sitemap, robots, manifest, dynamic OG image.
- Zod validation/sanitization, rate limits, admin protection, env secrets, security headers.
- Semantic HTML, skip link, focus states, ARIA labels/live regions, reduced motion.
- Extensible product/status/lead schema for Phase 2 checkout and more branches.

## Design & animation

- CSS-variable brand palette, Sora/Inter, rounded product cards, soft shadows, A/B/C grade badges, status ribbons.
- Animated counters/trust strip; word-by-word hero reveal; gradient mesh; floating parallax phones; per-branch live open pills.
- `whileInView` once scroll reveals with stagger; card hover lift/image zoom/quick-view; `AnimatePresence` layout filter transitions.
- Scroll-driven pinned repair process; brand/payment marquees; sticky shrinking header; route transitions.
- Transform/opacity only, `prefers-reduced-motion` support.

## Deliverables

- Complete source tree: `docs/PROJECT_STRUCTURE.md`.
- Install commands and setup: `README.md`, `docs/DEPLOYMENT.md`.
- Every variable: `.env.example`.
- Realistic seed: `scripts/seed.ts` + `lib/seed-data.ts`.
- Vercel deployment and staff stock workflow: `README.md`, `docs/DEPLOYMENT.md`.
- Brand/animation tuning notes: `README.md`, `docs/BRANDING.md`.

## Intentional Phase 2 scope

- Sell/exchange is a Coming soon page with a waitlist form, not an online valuation engine.
- Checkout is not implemented; product and lead schemas leave room for it.
- Bundled third-party demo photography, landmark-level map embeds, placeholder socials, placeholder email and pending Basistha phone are clearly marked TODO in `lib/config.ts` and the README.
