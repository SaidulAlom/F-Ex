# SEO & performance implementation

## Metadata

- Root metadata, metadataBase, Open Graph, Twitter cards, robots, icons and viewport are in `app/layout.tsx`.
- Each public route exports `buildMetadata()` from `lib/seo.ts` with a unique title, description, canonical URL and OG image.
- Product and branch pages use async `generateMetadata()` in Next.js 16 style with `params: Promise<…>`.
- `/admin/*` is `noindex, nofollow`.

## Structured data

| Schema | Location | Notes |
|---|---|---|
| LocalBusiness + Store + MobilePhoneStore | `components/seo/LocalBusinessJsonLd.tsx` | One object per branch; address, hours, phone, payments, map and social links |
| BreadcrumbList | `components/ui/Breadcrumbs.tsx` | Inner pages and product/category pages |
| Product + Offer | `components/seo/ProductJsonLd.tsx` | Price or quote-only offer, InStock/PreOrder/OutOfStock, grade/battery/warranty properties |

JSON-LD is escaped with `<` → `\\u003c` to prevent script injection.

## Indexation

- `app/sitemap.ts` includes static routes and every product slug.
- `app/robots.ts` allows public pages and blocks `/admin` and `/api`.
- `app/manifest.ts` provides a PWA manifest.
- `app/opengraph-image.tsx` generates a 1200×630 branded OG image through `next/og`.

## Local SEO copy

Pages deliberately mention Guwahati, Lokhra, Basistha, Sarusajai Stadium and Lakhi Mandir in natural copy rather than keyword stuffing. Branch pages include embedded maps, directions, IST hours, click-to-call and WhatsApp links.

## GA4 events

| Event name | Trigger |
|---|---|
| `call_click` | Every `CallLink` |
| `whatsapp_click` | Every `WhatsAppLink` |
| `directions_click` | Every `DirectionsLink` |
| `search` | Header search submit and API search |
| `select_item` | Search suggestion selection |
| `form_submit` | Contact, reservation, repair, sell waitlist, product enquiry and admin forms |

The GA4 script is skipped when the measurement ID is missing or still `G-XXXX…`.

## Performance choices

- Server components by default; only interactive widgets are client components.
- Heavy animation bundles are dynamically imported with sensible static-height fallbacks.
- Optimized local WebP photographs and Cloudinary images both use `next/image` AVIF/WebP optimisation.
- Public catalogue/content reads use `unstable_cache` with tags and a time-based fallback.
- Admin writes purge cache tags with `revalidateTag(tag, { expire: 0 })` and affected paths.
- Fonts are self-hosted through `next/font` with `display: swap` and fallback metrics.
- Animations are transform/opacity only and respect reduced motion.
- No client-side data fetching is required for the initial catalogue: filters are URL-driven and server-rendered.

## Lighthouse checklist before launch

1. Replace bundled demo photography with correctly sized Cloudinary photos owned by F-Ex Store (the current files are already small, but real photos should use responsive `sizes`).
2. Confirm production `NEXT_PUBLIC_SITE_URL`, canonical URLs and the exact Google Maps links.
3. Configure GA4 and verify events in DebugView.
4. Run mobile Lighthouse on the production Vercel URL, not the preview iframe.
5. Keep hero images under ~200 KB after Cloudinary transformations and avoid injecting third-party scripts beyond GA4.
