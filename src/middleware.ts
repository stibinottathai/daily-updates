import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PRODUCTION_DOMAIN = 'www.dailyupdatesnews.online';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';

  // Redirect any *.vercel.app request to the production domain
  if (host.endsWith('.vercel.app')) {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    url.host = PRODUCTION_DOMAIN;
    return NextResponse.redirect(url, { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except Next.js internals and static files
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$).*)',
  ],
};
