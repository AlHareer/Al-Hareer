import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSessionToken, COOKIE_NAME as ADMIN_COOKIE_NAME } from '@/lib/adminSession';

// Guards /admin/*. Customer auth (/account, /checkout) stays the existing
// client-side/localStorage flow for now — see project plan's phasing.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPath = pathname.startsWith('/admin') && pathname !== '/admin/login';

  if (!isAdminPath) {
    return NextResponse.next();
  }

  const adminSession = await verifyAdminSessionToken(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
  if (!adminSession) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
