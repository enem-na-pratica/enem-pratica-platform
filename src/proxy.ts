import { NextRequest, NextResponse } from "next/server";
import {
  executeMiddlewareChain,
  authMiddleware,
  aclMiddleware
} from '@/src/middleware';

export const config = {
  /**
   * This matcher defines which routes should run through the middleware.
   *
   * The regex below uses a "negative lookahead" (?!...) to EXCLUDE routes
   * that must NOT be handled by the middleware.
   *
   * The middleware will run for ALL routes, EXCEPT:
   * - /api/auth/login       → public login API endpoint
   * - _next/static          → Next.js static assets
   * - _next/image           → Next.js image optimization routes
   * - favicon.ico           → site favicon
   * - /access-denied        → public access denied page
   * - static media files    → .svg, .png, .jpg, .jpeg, .gif, .webp
   *
   * Important:
   * - The /login page itself is NOT excluded here.
   *   It must pass through the middleware so authenticated users
   *   can be redirected to the dashboard if necessary.
   */
  matcher: [
    "/((?!api/auth/login|_next/static|_next/image|favicon.ico|access-denied|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ],
};

// The order of middlewares matters.
// Middlewares are executed sequentially in the same order they are listed here.
const middlewares = [
  authMiddleware,
  aclMiddleware,
];

export async function proxy(request: NextRequest) {
  const response = await executeMiddlewareChain(request, middlewares);

  // If any middleware returned a redirect or error, short-circuit the request.
  if (response) {
    return response;
  }

  // Allows the request to continue and propagates any injected headers.
  return NextResponse.next({
    request: {
      headers: request.headers,
    }
  });
}