import { NextResponse, type NextRequest } from "next/server";
import { makeJwtAdapter } from '@/src/core/main/factories/common/auth';
import { ROUTES, AUTH_COOKIE_NAME } from "../config";
import type { MiddlewareHandler } from "../types";

const jwtAdapter = makeJwtAdapter();

export const authMiddleware: MiddlewareHandler = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const isGuestPage = ROUTES.GUEST_ONLY.includes(pathname);
  const isPublicPage = ROUTES.PUBLIC.includes(pathname);
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  let userPayload = null;

  // Invalid tokens trigger a forced logout on protected routes.
  if (token) {
    try {
      userPayload = jwtAdapter.verify(token);
    } catch {
      if (!isPublicPage && !isGuestPage) {
        const response = NextResponse.redirect(new URL(ROUTES.LOGIN_PATH, request.url));
        response.cookies.delete(AUTH_COOKIE_NAME);
        return response;
      }
    }
  }

  const isAuthenticated = !!userPayload;

  // Authenticated users should not access guest-only pages
  if (isAuthenticated && isGuestPage) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD_HOME, request.url));
  }

  // Unauthenticated users are redirected when accessing protected routes
  if (!isAuthenticated && !isGuestPage && !isPublicPage) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN_PATH, request.url));
  }

  // Injects user context into headers for downstream middlewares and handlers.
  if (isAuthenticated && userPayload) {
    request.headers.set("x-user-id", userPayload.id);
    request.headers.set("x-user-role", userPayload.role);
    request.headers.set("x-user-username", userPayload.username);
  }

  return null;
};