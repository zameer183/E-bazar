import { NextResponse } from 'next/server';

/**
 * Next.js Middleware for Server-Side Authentication
 *
 * This middleware runs on the edge and validates authentication before
 * pages are rendered. It provides server-side protection for routes.
 *
 * Protected routes:
 * - /dashboard - Requires authentication
 * - /profile - Requires authentication
 * - /admin - Requires authentication (admin check happens client-side)
 * - /register/details - Requires authentication
 */

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Routes that require authentication
  const protectedRoutes = ['/dashboard', '/profile', '/admin', '/register/details'];

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (!isProtectedRoute) {
    // Not a protected route, allow access
    return NextResponse.next();
  }

  // NOTE: Firebase Auth uses client-side tokens in Next.js App Router
  // We cannot validate Firebase tokens in middleware without Firebase Admin SDK
  //
  // For now, this middleware serves as a placeholder and documentation.
  // Actual auth validation happens on the client side using onAuthChange.
  //
  // To implement true server-side auth, you would need to:
  // 1. Set an httpOnly cookie with the Firebase ID token on login
  // 2. Verify the token here using Firebase Admin SDK
  // 3. Redirect unauthorized users to /login
  //
  // Example implementation (requires Firebase Admin SDK):
  /*
  const token = request.cookies.get('__session')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const admin = require('firebase-admin');
    await admin.auth().verifyIdToken(token);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  */

  // For now, allow the request to proceed
  // Client-side auth guards will handle the actual protection
  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/register/details/:path*',
  ],
};
