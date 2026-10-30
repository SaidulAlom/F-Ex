import { getToken } from 'next-auth/jwt';
import { NextResponse, type NextRequest } from 'next/server';

const OWNER_ONLY_PREFIXES = [
  '/admin/banners',
  '/admin/branches',
  '/admin/testimonials',
  '/api/admin/banners',
  '/api/admin/branches',
  '/api/admin/testimonials',
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === '/admin/login') {
    const existing = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (existing) return NextResponse.redirect(new URL('/admin', request.url));
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const isApi = pathname.startsWith('/api/');
  if (!token) {
    if (isApi) {
      return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });
    }
    const login = new URL('/admin/login', request.url);
    login.searchParams.set('callbackUrl', `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(login);
  }

  if (
    token.role !== 'Owner' &&
    OWNER_ONLY_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  ) {
    if (isApi) {
      return NextResponse.json({ ok: false, message: 'Owner access required' }, { status: 403 });
    }
    return NextResponse.redirect(new URL('/admin?error=owner-only', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
