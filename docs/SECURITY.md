# Security implementation notes

## Authentication and authorisation

- `lib/auth.ts` configures NextAuth credentials with a JWT session lasting eight hours.
- Passwords are bcrypt-hashed with cost 12 by the seed scripts and compared with `bcrypt.compare`.
- `types/next-auth.d.ts` augments Session, User and JWT with `role` and `branch`.
- `proxy.ts` is Next.js 16's renamed middleware convention. It protects every `/admin/*` and `/api/admin/*` route and blocks staff from known owner-only prefixes.
- Every admin API independently calls `getAdminUser()` through `withAdmin()`. The proxy is never the only authorisation boundary.
- `requireOwner()` restricts banners, testimonials, branch settings and featured products.
- `requireBranchAccess()` prevents BranchStaff from creating, editing, deleting or re-statusing products outside their branch. Products marked `both` are Owner-managed.
- Lead queries and status updates are branch-scoped for staff.

## Input validation and sanitization

- All public forms and admin mutations use Zod schemas in `lib/validators.ts`.
- `lib/sanitize.ts` strips tags/control characters, validates URLs, escapes HTML for emails, escapes regex input and neutralises CSV formula injection.
- Cloudinary image URLs are restricted to `res.cloudinary.com` or local `/images/...` placeholders.
- Banner CTA links must be an internal path or a complete `http(s)` URL.
- Login callback URLs are restricted to same-origin paths.

## Rate limiting and spam

`lib/rate-limit.ts` applies per-IP buckets:

| Endpoint | Limit |
|---|---|
| `POST /api/leads` | 6 / minute |
| `GET /api/search` | 40 / minute |
| `POST /api/uploads/sign` | 12 / minute |

Every public form has a hidden `companyWebsite` honeypot. Non-empty submissions are silently accepted without saving or emailing, so bots see success while staff do not receive noise.

The limiter is in-memory and per Node process. For coordinated multi-region protection, replace it with Upstash Redis or a similar store.

## Cloudinary uploads

- The API secret is server-only.
- `/api/uploads/sign` creates a short-lived signature for `timestamp` and `folder`.
- Product image signing requires an authenticated admin; repair photo signing is public but rate-limited.
- The client validates file type and size, then resizes to WebP before direct upload.
- `next/image` remote patterns only allow `res.cloudinary.com`.

## Headers and CSP

`next.config.mjs` sets:

- `Content-Security-Policy` with separate script, style, image, font, connect, form and frame directives.
- `frame-ancestors 'self' https://*.e2b.app https://*.vercel.app` so Arena/Vercel previews can embed the site. Remove the extra origins if you do not need preview embedding.
- No legacy `X-Frame-Options`, because CSP `frame-ancestors` supersedes it in modern browsers.
- `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-XSS-Protection`.
- HSTS in production only.
- `unsafe-eval` in development only. `unsafe-inline` remains for Next.js/GA4 inline scripts; a nonce-based CSP is a future hardening step.

## Secrets

- Only public variables use `NEXT_PUBLIC_`: site URL, GA measurement ID and the reserved Cloudinary cloud name.
- MongoDB URI, NextAuth secret, Cloudinary API secret, Resend key, seed owner password and demo credentials stay server-side.
- `.env.local` and `.env.*.local` are gitignored.
- The health endpoint returns only configuration booleans, never secret values.

## Data handling caveats

- Demo mode stores admin edits in `global.__fexDemoStore`, which is process-local and resets. Never use it for production customer data.
- In production, always set `MONGODB_URI` and `DEMO_MODE=false`.
- Resend emails escape lead content before inserting it into HTML.
- Rate-limited lead APIs return generic errors; detailed stack traces are logged server-side only.
