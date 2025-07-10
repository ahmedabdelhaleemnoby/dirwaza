import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Helper function to get admin user data from cookie
function getAdminUserData(request: NextRequest) {
  try {
    const userData = request.cookies.get('admin-user-data')?.value;
    if (!userData) return null;
    return JSON.parse(userData);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  // Protect dashboard routes - Admin only
  if (
    pathname.startsWith(`/${routing.defaultLocale}/dashboard`) ||
    pathname.startsWith('/dashboard')
  ) {
    // const authToken = request.cookies.get('auth-token')||true;
      // if (!authToken) {
      //   const url = request.nextUrl.clone();
      //   url.pathname = `/${routing.defaultLocale}/login`;
      //   return Response.redirect(url);}
    const adminAuthToken = request.cookies.get('admin-auth')?.value;
    const adminUserData = getAdminUserData(request);
    
    // Check if admin is authenticated and has admin role
    if (!adminAuthToken || !adminUserData || adminUserData.role !== 'admin') {
      // Clear invalid admin cookies
      const response = NextResponse.redirect(new URL(`/${routing.defaultLocale}/admin/login`, request.url));
      response.cookies.delete('admin-auth');
      response.cookies.delete('admin-user-data');
      return response;
    }
  }

  // Redirect authenticated admin from admin login to dashboard
  if (
    pathname.startsWith(`/${routing.defaultLocale}/admin/login`) ||
    pathname.startsWith('/admin/login')
  ) {
    const adminAuthToken = request.cookies.get('admin-auth')?.value;
    const adminUserData = getAdminUserData(request);
    
    if (adminAuthToken && adminUserData && adminUserData.role === 'admin') {
      url.pathname = `/${routing.defaultLocale}/dashboard`;
      return NextResponse.redirect(url);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
};