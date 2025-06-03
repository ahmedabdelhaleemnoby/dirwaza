import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect dashboard routes
  if (
    pathname.startsWith(`/${routing.defaultLocale}/dashboard`) ||
    pathname.startsWith('/dashboard')
  ) {
    const authToken = request.cookies.get('auth-token');
    if (!authToken) {
      const url = request.nextUrl.clone();
      url.pathname = `/${routing.defaultLocale}/auth/login`;
      return Response.redirect(url);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
};