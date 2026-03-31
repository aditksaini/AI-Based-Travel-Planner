import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hasAuthSession = request.cookies.has('auth_session');
  const hasGuestSession = request.cookies.has('guest_session');
  
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/home') || request.nextUrl.pathname.startsWith('/trips');
  
  // If the user is trying to access a protected page and has NO session 
  // (neither authenticated nor guest), immediately redirect them to "/".
  if (isProtectedRoute && !hasAuthSession && !hasGuestSession) {
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Otherwise, allow the request to proceed.
  return NextResponse.next();
}

// Config to specify which paths the middleware should intercept
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
