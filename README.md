# F-Ex Store — Guwahati mobile phone store & admin panel

A complete, deployable Next.js App Router website for **F-Ex Store**, a mobile-phone dealership with branches in **Lokhra** and **Basistha**, Guwahati. The build includes public catalogue/shop pages, repair and lead forms, branch pages, SEO/structured data, GA4 events, NextAuth admin authentication, MongoDB/Mongoose models, signed Cloudinary uploads, Resend lead notifications and Vercel-ready on-demand ISR.

> Everything is implemented in this workspace — no prototype stubs or omitted route bodies. See [`docs/PROJECT_STRUCTURE.md`](docs/PROJECT_STRUCTURE.md) for the complete source tree.

---

## 1. Stack

| Concern | Implementation |
|---|---|
| Framework | Next.js **16.4.3** App Router, React **19.3.1**, TypeScript strict |
| Styling | Tailwind CSS **4.3.3**, CSS variables, `next/font` Sora + Inter |
| Animation | Framer Motion **14.6.0**, lazy-loaded heavy sections, transform/opacity only |
| Database | MongoDB Atlas + Mongoose **8.24.7** |
| Auth | NextAuth **4.24.15** credentials, bcrypt-hashed passwords, Owner / BranchStaff JWT roles |
| Forms | React Hook Form + Zod **4** + `@hookform/resolvers` |
| Images | `next/image`, optimized local WebP demo photographs, signed Cloudinary direct uploads |
| Email | Resend transactional lead notifications |
| Analytics | GA4 via `next/script`, call/WhatsApp/directions/search/form events |
| Deployment | Vercel, `revalidateTag` + `revalidatePath` on-demand ISR |

`npm audit` reports **0 vulnerabilities** with the pinned dependency set.

---

## 2. Install & run

Requires **Node.js 20+** (developed on Node 20.20.2) and npm 10+.

```bash
cd f-ex-store
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

Without a MongoDB connection, the site automatically renders realistic sample content. In development, or with `DEMO_MODE=true`, the admin also works against a **per-process, non-durable** demo store. This is for preview only; production admin changes require MongoDB.

### Verification

```bash
npm run typecheck
npm run lint
npm run build
npm run check         # typecheck && lint && build
npm audit
```

### Seed a real database

> `npm run seed` **deletes and replaces** the Product, Branch, Lead, Banner, Testimonial and User collections. Do not run it against a database with live customer leads.

```bash
# Set MONGODB_URI, SEED_OWNER_* in .env.local first
npm run seed
```

Seed contents: 12 products across new/used/accessories/gadgets/landline, 2 branches, 3 banners, 5 approved testimonials, 0 leads and one bcrypt-hashed Owner.

Create or update a branch-scoped staff account:

```bash
# Set STAFF_NAME, STAFF_EMAIL, STAFF_PASSWORD, STAFF_BRANCH in .env.local
npm run seed:staff
```

Regenerate optimized local WebP demo photographs from the source assets (requires Python 3 with Pillow):

```bash
npm run images:prepare
```

---

## 3. Required environment variables

Every variable is documented in [`.env.example`](.env.example):

- `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `DEMO_MODE`, `DEMO_OWNER_EMAIL`, `DEMO_OWNER_PASSWORD`
- `MONGODB_URI`
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- `SEED_OWNER_NAME`, `SEED_OWNER_EMAIL`, `SEED_OWNER_PASSWORD`
- `STAFF_NAME`, `STAFF_EMAIL`, `STAFF_PASSWORD`, `STAFF_BRANCH`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_FOLDER`
- `RESEND_API_KEY`, `LEAD_FROM_EMAIL`, `LEAD_NOTIFICATION_EMAIL`

Never place the Cloudinary API secret, MongoDB URI, NextAuth secret or Resend key in a `NEXT_PUBLIC_` variable.

---

## 4. Client data & images to replace before launch

All branch data, WhatsApp numbers and social links are centralised in [`lib/config.ts`](lib/config.ts). Search that file for `TODO` and replace:

1. Confirmed business email.
2. Dedicated WhatsApp Business numbers for general, Lokhra and Basistha enquiries. Until replaced, Basistha uses the Lokhra number as a safe fallback.
3. Exact Google Maps place embed URLs and social profile URLs. Current map embeds use nearby landmarks.
4. Basistha direct phone number. The UI currently says “coming soon” and routes calls to the Lokhra main line rather than inventing a number.
5. `NEXT_PUBLIC_SITE_URL`, `NEXTAUTH_URL` and GA4 measurement ID.
6. Bundled demo photography. The site uses real WebP photographs for products, branch cards, banners and the hero, but they are third-party demo assets rather than photos of the actual shop or stock. The hero shows two transparent, frame-free single-phone cutouts with no hands or lifestyle scenes. Source URLs and rights notes are in [`docs/IMAGE_SOURCES.md`](docs/IMAGE_SOURCES.md). Before launch, replace them with F-Ex Store's own licensed Cloudinary product and branch photographs.

Admin branch edits can then override phone, address and opening hours in MongoDB without editing code.

---

## 5. MongoDB Atlas setup

1. Create a free/shared MongoDB Atlas cluster in a region close to India, e.g. Mumbai.
2. Create a database user and allow Vercel IPs or `0.0.0.0/0` with strong credentials.
3. Copy the SRV URI into `MONGODB_URI` and add a database path such as `/f-ex-store`.
4. Run `npm run seed` once from your local machine or a secure maintenance shell.
5. Set `DEMO_MODE=false` in production.

The six Mongoose models are in `models/`: `Product`, `Branch`, `Lead`, `Banner`, `Testimonial`, `User`. Indexes cover catalogue filtering, slug lookup, lead search/status and active banners.

---

## 6. Cloudinary setup

1. Create a Cloudinary account and copy Cloud Name, API Key and API Secret.
2. Set the three server variables plus `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and optional `CLOUDINARY_FOLDER`.
3. In Cloudinary Settings → Upload, keep signed uploads enabled. Do **not** create an unsigned preset.
4. `POST /api/uploads/sign` issues a short-lived signature for `timestamp` + `folder`. Product uploads require an admin session; repair photo uploads are public but rate-limited.
5. The browser resizes JPG/PNG/WebP files to a 1600px WebP before direct upload. Product images go under `f-ex-store/products`, repair photos under `f-ex-store/repair-requests`.
6. `next.config.mjs` permits `res.cloudinary.com` in `images.remotePatterns` and CSP.

The API secret never reaches the browser.

---

## 7. Resend setup

1. Verify your sending domain in Resend.
2. Create an API key and set `RESEND_API_KEY`.
3. Set `LEAD_FROM_EMAIL` to a verified sender such as `F-Ex Store <leads@yourdomain.com>`.
4. Set `LEAD_NOTIFICATION_EMAIL` to the owner address or a comma-separated staff list.
5. Submit a public contact/repair/reservation/sell form. The lead is saved first; a Resend email is then sent with escaped lead content and an admin link. Email failure never loses the database lead.

---

## 8. Vercel deployment

1. Push this project to GitHub/GitLab and import it into Vercel.
2. Framework preset: **Next.js**. Build command: `npm run build`. Node.js: **20+**.
3. Add every production variable from `.env.example`. Use the real production domain for both `NEXT_PUBLIC_SITE_URL` and `NEXTAUTH_URL`.
4. Generate `NEXTAUTH_SECRET` with `openssl rand -base64 32`.
5. Set `DEMO_MODE=false`.
6. Seed the production database from a secure machine using the production `MONGODB_URI`.
7. Deploy. Then run `npm run check` locally and verify `/api/health` returns `databaseConfigured: true`.

### On-demand ISR / fast stock updates

Public reads use `unstable_cache` with tags (`products`, `banners`, `branches`, `testimonials`) plus a time-based fallback. Every admin mutation calls `revalidatePublicContent()` with `revalidateTag(tag, { expire: 0 })` and `revalidatePath`, so a product status change appears immediately.

From the admin panel:

1. Go to **Products**.
2. Use the inline **Status** dropdown → `Available` / `Reserved` / `Sold`.
3. The API validates the session and branch scope, updates MongoDB, then purges the product tag and affected public paths.
4. Branch staff only see/edit products assigned to their own branch. Shared `both` products are Owner-managed.

---

## 9. Admin roles

- **Owner**: full product CRUD, featured products, banners/offers, testimonials, branch editor, all leads and CSV export.
- **BranchStaff**: product CRUD/status for their own branch only and leads for their branch or `both`. Owner-only pages are hidden in the UI and blocked by both the proxy and individual APIs.

In Next.js 16, the former `middleware.ts` convention is renamed to **`proxy.ts`**. This project uses [`proxy.ts`](proxy.ts) as the route-protection middleware; it checks the NextAuth JWT for every `/admin/*` and `/api/admin/*` route. API route handlers re-check the session instead of trusting the proxy alone.

Login: `/admin/login`. Demo credentials work only when no MongoDB is configured and demo mode is active.

---

## 10. Design & animation tuning

- Brand colour channels live at the top of [`app/globals.css`](app/globals.css). Original palette: navy `#0B1220`, electric blue `#2563EB`, orange `#FF6B2C`, off-white `#F7F8FA`.
- Display/body fonts are loaded in `app/layout.tsx` via `next/font/google` (Sora + Inter).
- Hero parallax ranges and word-reveal delays are commented in `components/motion/HeroMotion.tsx`.
- Search debounce is in `components/layout/SearchBox.tsx`; marquee/orb timings are in `app/globals.css`.
- All animation is transform/opacity. `MotionConfig reducedMotion="user"`, CSS `@media (prefers-reduced-motion: reduce)` and component-level checks respect the OS setting.

See [`docs/BRANDING.md`](docs/BRANDING.md) for a quick tuning checklist.

---

## 11. SEO, accessibility & security

- Per-page metadata, canonical URLs, Open Graph/Twitter cards, `sitemap.xml`, `robots.txt`, web manifest and dynamic OG image.
- JSON-LD: LocalBusiness for both branches, BreadcrumbList on inner pages, Product/Offer on detail pages.
- Server components by default; only interactive sections are client components.
- `next/image`, lazy-loaded hero/repair/marquee sections, optimized local WebP demo photographs and no render-blocking external CSS.
- Semantic landmarks, skip link, keyboard-accessible menus/forms/gallery, visible focus rings, ARIA labels/live regions and WCAG-friendly colour contrast.
- Zod validation and sanitization on every API input; honeypot + per-IP rate limit on lead submissions, search and upload signatures.
- Security headers and a preview-safe CSP in `next.config.mjs`.
- In-memory rate limiting is per server instance. For very high traffic or multi-region coordinated limits, replace `lib/rate-limit.ts` with Upstash Redis or a similar provider.

More detail: [`docs/SECURITY.md`](docs/SECURITY.md) and [`docs/SEO.md`](docs/SEO.md).

---

## 12. Known Phase 2 boundaries

- `/sell-exchange` intentionally displays a **Coming soon** state plus a waitlist form. No checkout or automated valuation is implemented.
- Checkout is not part of Phase 1; product schema/routes are structured so payments and cart can be added later.
- Bundled real photographs are third-party demo assets. Replace them with F-Ex Store's own licensed Cloudinary product and branch photos before launch.
- Exact social/map links and the Basistha direct phone require client confirmation.
- Demo-mode admin data is per-process and resets; it is not suitable for production.

---

## 13. Useful scripts

```bash
npm run dev          # Start local development
npm run build        # Production build
npm run start        # Start production server
npm run typecheck    # tsc --noEmit
npm run lint         # ESLint flat config
npm run check        # typecheck + lint + build
npm run seed         # Destructive MongoDB seed
npm run seed:staff   # Create/update BranchStaff account
npm run images:prepare # Rebuild optimized WebP photos (Python + Pillow)
```
# F-Ex
