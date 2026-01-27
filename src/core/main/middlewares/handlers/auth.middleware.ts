import { NextResponse } from "next/server";
import type { TokenPayload } from "@/src/core/domain/contracts/auth";
import { authGuard } from "@/src/core/main/middlewares/guards";
import type { Middleware } from "@/src/core/main/middlewares/interfaces";

const GUEST_ONLY_PAGES = [
  "/login",
  "/register"
];

const PUBLIC_PAGES = [
  "/",
  "/about",
  "/contact"
];

export const AuthMiddleware: Middleware = async (request) => {
  const { pathname } = request.nextUrl;

  const isGuestPage = GUEST_ONLY_PAGES.includes(pathname);
  const isPublicPage = PUBLIC_PAGES.includes(pathname);

  const authResult = authGuard(request);
  const isAuthenticated = !('response' in authResult);

  if (isPublicPage) {
    // This is a public page, but we inject logged-in user data for personalization.
    if (isAuthenticated) {
      const { user } = authResult as { user: TokenPayload };
      request.headers.set("x-user-id", user.id);
      request.headers.set("x-user-role", user.role);
      request.headers.set("x-user-username", user.username);
    }
    return null;
  }

  if (isAuthenticated && isGuestPage) {
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = '/dashboard';
    return NextResponse.redirect(newUrl);
  }

  if (!isAuthenticated && !isGuestPage) {
    return authResult.response;
  }

  if (!isAuthenticated && isGuestPage) {
    return null;
  }

  // Default case: Logged-in user accessing a protected route.
  const { user } = authResult as { user: TokenPayload };
  request.headers.set("x-user-id", user.id);
  request.headers.set("x-user-role", user.role);
  request.headers.set("x-user-username", user.username);

  return null;
};