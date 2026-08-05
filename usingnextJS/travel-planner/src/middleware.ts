import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hasAuthSession = 
    request.cookies.has('auth_session') ||
    request.cookies.has('authjs.session-token') ||
    request.cookies.has('__Secure-authjs.session-token') ||
    request.cookies.has('next-auth.session-token') ||
    request.cookies.has('__Secure-next-auth.session-token');

  const hasGuestSession = request.cookies.has('guest_session');

  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith('/home') || 
    request.nextUrl.pathname.startsWith('/trips');

  if (isProtectedRoute && !hasAuthSession && !hasGuestSession) {
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
