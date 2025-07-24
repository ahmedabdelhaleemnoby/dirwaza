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

// Helper function to get user auth state from cookies
function getUserAuthState(request: NextRequest) {
  try {
    const token = request.cookies.get('auth')?.value;
    const userData = request.cookies.get('user-data')?.value;
    
    if (!token || !userData) return { isAuthenticated: false };
    
    const user = JSON.parse(userData);
    return {
      isAuthenticated: true,
      token,
      user
    };
  } catch {
    return { isAuthenticated: false };
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

  // Protect client routes that require authentication
  if (
    pathname.startsWith(`/${routing.defaultLocale}/profile`) ||
    pathname.startsWith('/profile') 
    // ||
    // pathname.startsWith(`/${routing.defaultLocale}/cart`) ||
    // pathname.startsWith('/cart') ||
    // pathname.startsWith(`/${routing.defaultLocale}/operator/payment`) ||
    // pathname.startsWith('/operator/payment') ||
    // pathname.startsWith(`/${routing.defaultLocale}/rest`) && pathname.includes('/payment') ||
    // pathname.startsWith(`/${routing.defaultLocale}/training-booking`) ||
    // pathname.startsWith('/training-booking')
  ) {
    const authState = getUserAuthState(request);
    
    if (!authState.isAuthenticated) {
      // Redirect to login page
      url.pathname = `/${routing.defaultLocale}/login`;
      return NextResponse.redirect(url);
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

  // Redirect authenticated users from login/otp to home page
  if (
    pathname.startsWith(`/${routing.defaultLocale}/login`) ||
    pathname.startsWith('/login') ||
    pathname.startsWith(`/${routing.defaultLocale}/otp`) ||
    pathname.startsWith('/otp')
  ) {
    const authState = getUserAuthState(request);
    
    if (authState.isAuthenticated) {
      url.pathname = `/${routing.defaultLocale}`;
      return NextResponse.redirect(url);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
};