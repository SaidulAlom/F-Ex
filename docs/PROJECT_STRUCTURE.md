# F-Ex Store — complete project structure

Generated from the workspace source tree. `node_modules`, build output and local secrets are intentionally omitted.

```text
f-ex-store/
├── app/
│   ├── (site)/
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── accessories/
│   │   │   └── page.tsx
│   │   ├── branches/
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── delivery-pickup/
│   │   │   └── page.tsx
│   │   ├── emi-payments/
│   │   │   └── page.tsx
│   │   ├── new-phones/
│   │   │   └── page.tsx
│   │   ├── product/
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── repair/
│   │   │   └── page.tsx
│   │   ├── second-hand-phones/
│   │   │   └── page.tsx
│   │   ├── sell-exchange/
│   │   │   └── page.tsx
│   │   ├── shop/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── admin/
│   │   ├── (panel)/
│   │   │   ├── banners/
│   │   │   │   └── page.tsx
│   │   │   ├── branches/
│   │   │   │   └── page.tsx
│   │   │   ├── leads/
│   │   │   │   └── page.tsx
│   │   │   ├── products/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── edit/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── testimonials/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── admin/
│   │   │   ├── banners/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── branches/
│   │   │   │   └── route.ts
│   │   │   ├── leads/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── export/
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── products/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── featured/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   ├── status/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   └── testimonials/
│   │   │       ├── [id]/
│   │   │       │   └── route.ts
│   │   │       └── route.ts
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── health/
│   │   │   └── route.ts
│   │   ├── leads/
│   │   │   └── route.ts
│   │   ├── search/
│   │   │   └── route.ts
│   │   └── uploads/
│   │       └── sign/
│   │           └── route.ts
│   ├── error.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── manifest.ts
│   ├── not-found.tsx
│   ├── opengraph-image.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── assets/
│   ├── source-images/
│   │   ├── apple-20w-adapter-alt.jpg
│   │   ├── apple-20w-adapter.png
│   │   ├── banner-hero.jpg
│   │   ├── banner-repair.jpg
│   │   ├── banner-weekend.jpg
│   │   ├── boat-airdopes-alt.jpg
│   │   ├── boat-airdopes.jpg
│   │   ├── generic-electronics.jpg
│   │   ├── iphone-13-lineup.jpg
│   │   ├── iphone-13-purple.jpg
│   │   ├── iphone-15-blue.jpg
│   │   ├── nothing-phone-2a-back.webp
│   │   ├── nothing-phone-2a.jpg
│   │   ├── oneplus-nord-ce3-lite-alt.png
│   │   ├── oneplus-nord-ce3-lite.png
│   │   ├── panasonic-landline-alt.png
│   │   ├── panasonic-landline.png
│   │   ├── redmi-note-14-pro-plus-camera.png
│   │   ├── redmi-note-14-pro-plus.jpg
│   │   ├── samsung-s21-fe-alt.jpg
│   │   ├── samsung-s21-fe.png
│   │   ├── samsung-s24-fe-box.jpg
│   │   ├── samsung-s24-fe.jpg
│   │   ├── store-basistha.jpg
│   │   ├── store-lokhra.jpg
│   │   ├── usb-c-cable-alt.jpg
│   │   ├── usb-c-cable.jpg
│   │   ├── vivo-v50-camera.png
│   │   └── vivo-v50-rose-red.png
│   ├── image-sources.json
│   └── README.md
├── components/
│   ├── admin/
│   │   ├── admin-api-client.ts
│   │   ├── AdminLoginForm.tsx
│   │   ├── AdminPageHeader.tsx
│   │   ├── AdminProductTable.tsx
│   │   ├── AdminShell.tsx
│   │   ├── AdminStatCards.tsx
│   │   ├── BannerManager.tsx
│   │   ├── BranchManager.tsx
│   │   ├── FeaturedProductsManager.tsx
│   │   ├── LeadsTable.tsx
│   │   ├── ProductForm.tsx
│   │   └── TestimonialManager.tsx
│   ├── analytics/
│   │   ├── ContactLinks.tsx
│   │   ├── GoogleAnalytics.tsx
│   │   └── TrackableLink.tsx
│   ├── branches/
│   │   ├── BranchCards.tsx
│   │   ├── BranchMap.tsx
│   │   └── OpenStatusPill.tsx
│   ├── content/
│   │   ├── CatalogPage.tsx
│   │   ├── CTASection.tsx
│   │   ├── FAQ.tsx
│   │   ├── FeatureCards.tsx
│   │   ├── PageHero.tsx
│   │   └── StepGrid.tsx
│   ├── forms/
│   │   ├── CloudinaryUploader.tsx
│   │   ├── ContactForm.tsx
│   │   ├── EnquiryForm.tsx
│   │   ├── FormField.tsx
│   │   ├── RepairForm.tsx
│   │   ├── ReservationForm.tsx
│   │   └── SellWaitlistForm.tsx
│   ├── home/
│   │   ├── CategoryTiles.tsx
│   │   ├── LiveStockSection.tsx
│   │   ├── OfferGrid.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── TrustStrip.tsx
│   ├── layout/
│   │   ├── MobileCallBar.tsx
│   │   ├── SearchBox.tsx
│   │   ├── SiteFooter.tsx
│   │   └── SiteHeader.tsx
│   ├── motion/
│   │   ├── BrandMarquee.tsx
│   │   ├── CountUp.tsx
│   │   ├── HeroMotion.tsx
│   │   ├── LazyMotionSections.tsx
│   │   ├── MotionProvider.tsx
│   │   ├── PageTransition.tsx
│   │   ├── RepairProcess.tsx
│   │   └── Reveal.tsx
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductExplorer.tsx
│   │   └── ProductGallery.tsx
│   ├── providers/
│   │   └── SessionProvider.tsx
│   ├── seo/
│   │   ├── JsonLd.tsx
│   │   ├── LocalBusinessJsonLd.tsx
│   │   └── ProductJsonLd.tsx
│   └── ui/
│       ├── Badge.tsx
│       ├── Breadcrumbs.tsx
│       ├── button-styles.ts
│       ├── cn.ts
│       ├── Container.tsx
│       ├── EmptyState.tsx
│       ├── PaymentBadges.tsx
│       ├── Rating.tsx
│       ├── SectionHeading.tsx
│       └── SmartImage.tsx
├── docs/
│   ├── ACCEPTANCE.md
│   ├── BRANDING.md
│   ├── DEPLOYMENT.md
│   ├── FILE_MANIFEST.md
│   ├── IMAGE_SOURCES.md
│   ├── PROJECT_STRUCTURE.md
│   ├── SECURITY.md
│   └── SEO.md
├── hooks/
│   ├── use-analytics.ts
│   ├── use-debounce.ts
│   ├── use-open-status.ts
│   ├── use-origin.ts
│   └── use-url-filters.ts
├── lib/
│   ├── data/
│   │   ├── catalog.ts
│   │   ├── common.ts
│   │   ├── content.ts
│   │   ├── index.ts
│   │   ├── leads.ts
│   │   ├── stats.ts
│   │   └── users.ts
│   ├── admin-api.ts
│   ├── analytics.ts
│   ├── api-auth.ts
│   ├── api-response.ts
│   ├── auth.ts
│   ├── branch-hours.ts
│   ├── cache.ts
│   ├── cloudinary.ts
│   ├── config.ts
│   ├── constants.ts
│   ├── csv.ts
│   ├── demo-store.ts
│   ├── email.ts
│   ├── env.ts
│   ├── mongodb.ts
│   ├── permissions.ts
│   ├── query.ts
│   ├── rate-limit.ts
│   ├── sanitize.ts
│   ├── seed-data.ts
│   ├── seo.ts
│   ├── serialization.ts
│   ├── types.ts
│   ├── utils.ts
│   └── validators.ts
├── models/
│   ├── Banner.ts
│   ├── Branch.ts
│   ├── index.ts
│   ├── Lead.ts
│   ├── Product.ts
│   ├── Testimonial.ts
│   └── User.ts
├── public/
│   └── images/
│       ├── banners/
│       │   ├── hero-phones.webp
│       │   ├── repair-offer.webp
│       │   └── weekend-offer.webp
│       ├── branches/
│       │   ├── basistha-store.webp
│       │   └── lokhra-store.webp
│       ├── hero/
│       │   ├── phone-blue.webp
│       │   └── phone-red.webp
│       ├── products/
│       │   ├── accessories.webp
│       │   ├── apple-20w-adapter.webp
│       │   ├── boat-airdopes-141-detail.webp
│       │   ├── boat-airdopes-141.webp
│       │   ├── generic-product.webp
│       │   ├── iphone-13-midnight.webp
│       │   ├── iphone-13-purple.webp
│       │   ├── iphone-15-blue.webp
│       │   ├── nothing-phone-2a-detail.webp
│       │   ├── nothing-phone-2a.webp
│       │   ├── oneplus-nord-ce3-lite-detail.webp
│       │   ├── oneplus-nord-ce3-lite.webp
│       │   ├── panasonic-landline-detail.webp
│       │   ├── panasonic-landline.webp
│       │   ├── redmi-note-14-pro-plus-detail.webp
│       │   ├── redmi-note-14-pro-plus.webp
│       │   ├── samsung-s21-fe-detail.webp
│       │   ├── samsung-s21-fe.webp
│       │   ├── samsung-s24-fe-detail.webp
│       │   ├── samsung-s24-fe.webp
│       │   ├── usb-c-cable-detail.webp
│       │   ├── usb-c-cable.webp
│       │   ├── vivo-v50-detail.webp
│       │   └── vivo-v50-rose-red.webp
│       ├── fex-logo.svg
│       └── README.md
├── scripts/
│   ├── create-staff.ts
│   ├── prepare-real-images.py
│   └── seed.ts
├── types/
│   └── next-auth.d.ts
├── .gitignore
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── proxy.ts
├── README.md
├── tsconfig.json
```

## Route map

- Public: `/`, `/shop`, `/new-phones`, `/second-hand-phones`, `/accessories`, `/repair`, `/emi-payments`, `/delivery-pickup`, `/sell-exchange`, `/about`, `/contact`, `/branches`, `/branches/[slug]`, `/product/[slug]`.
- Admin: `/admin/login`, `/admin`, `/admin/products`, `/admin/products/new`, `/admin/products/[id]/edit`, `/admin/banners`, `/admin/leads`, `/admin/branches`, `/admin/testimonials`.
- APIs: `/api/auth/[...nextauth]`, `/api/search`, `/api/leads`, `/api/uploads/sign`, `/api/health`, and all `/api/admin/*` routes.
- Metadata: `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/opengraph-image`.

## Image assets

Real third-party demo photography is stored in `assets/source-images/` and optimized into `public/images/` by `scripts/prepare-real-images.py`. Source URLs and rights notes are in `docs/IMAGE_SOURCES.md`.
