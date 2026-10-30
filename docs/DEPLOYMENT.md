# Vercel deployment guide

## 1. Pre-flight

From the project root:

```bash
npm install
npm run check
npm audit
```

All three checks must pass. `npm run check` runs strict TypeScript, ESLint and a production build. The build is verified to work without MongoDB by using sample content; production admin writes still need a database.

## 2. Create the external services

### MongoDB Atlas

- Create a cluster and database user.
- Add the Vercel egress IPs or `0.0.0.0/0` with a strong password.
- Use a URI with a database path: `mongodb+srv://.../f-ex-store?retryWrites=true&w=majority`.
- From a secure local shell, run `npm run seed` once. The script is destructive; it replaces the six sample collections.

### Cloudinary

- Create a cloud and copy Cloud Name, API Key and API Secret.
- No unsigned upload preset is needed. `/api/uploads/sign` signs `timestamp` and `folder` on the server.
- Optionally restrict uploads further with Cloudinary upload limits and moderation settings.

### Resend

- Verify the sending domain.
- Create an API key.
- Set `LEAD_FROM_EMAIL` to a verified sender and `LEAD_NOTIFICATION_EMAIL` to the staff inbox(es).

### Google Analytics 4

- Create a GA4 web data stream.
- Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to the `G-…` measurement ID. Leave the placeholder value if GA4 is not ready; the script simply does not render.

## 3. Environment variables in Vercel

Add these in **Project → Settings → Environment Variables**, then redeploy:

```text
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
DEMO_MODE=false
DEMO_OWNER_EMAIL=owner@your-domain.com
DEMO_OWNER_PASSWORD=<unused-when-db-is-connected>
MONGODB_URI=mongodb+srv://...
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<openssl rand -base64 32>
SEED_OWNER_NAME=F-Ex Store Owner
SEED_OWNER_EMAIL=owner@your-domain.com
SEED_OWNER_PASSWORD=<strong-password>
STAFF_NAME=...
STAFF_EMAIL=...
STAFF_PASSWORD=...
STAFF_BRANCH=lokhra
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_FOLDER=f-ex-store
RESEND_API_KEY=re_...
LEAD_FROM_EMAIL=F-Ex Store <leads@your-verified-domain.com>
LEAD_NOTIFICATION_EMAIL=owner@your-domain.com
```

`DEMO_OWNER_*` and `STAFF_*` are not runtime secrets needed by the web app, but keeping them in the same local `.env.local` makes seeding reproducible. Do not expose them publicly.

## 4. Build settings

- Framework preset: **Next.js**
- Node.js version: **20.x or newer**
- Install command: `npm install`
- Build command: `npm run build`
- Output: default Next.js serverless output
- Root directory: the directory containing `package.json`

No custom `vercel.json` is required.

## 5. Post-deploy checks

1. `GET /api/health` → `databaseConfigured: true`, `demoMode: false`.
2. `/admin/login` → sign in with the seeded Owner.
3. Create a product with a Cloudinary image; verify `/shop` and `/product/[slug]`.
4. Change product status to `Sold`; refresh public page and confirm the Sold ribbon.
5. Submit `/contact`; confirm the lead appears in `/admin/leads` and a Resend email arrives.
6. Export CSV from `/admin/leads`.
7. Check `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/opengraph-image`.
8. Verify GA4 DebugView events: `call_click`, `whatsapp_click`, `directions_click`, `form_submit`, `search`.

## 6. Scaling notes

- `lib/rate-limit.ts` uses a per-instance in-memory bucket. On Vercel, each lambda has independent state. For strict global limits, swap it for Upstash Redis or Vercel KV.
- Public catalogue reads are tag-cached and revalidated on writes. Keep MongoDB indexes from the models; they are created on first model initialisation/seed.
- The demo store is global to a single Node process only. It is not a production data store.
- `revalidateTag(tag, { expire: 0 })` is Next.js 16's immediate-expiry signature. If you upgrade Next.js, re-check the `next/cache` API.

## 7. Rollback

Because admin mutations are database-only, redeploying a previous Git commit rolls back application code without changing leads or products. Keep regular MongoDB Atlas backups before running the destructive seed script.
