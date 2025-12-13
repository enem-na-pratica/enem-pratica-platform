import { NextRequest, NextResponse } from "next/server";
import { authenticate, authorizeByRole } from "@/src/proxy-utils";

const PUBLIC_API_ROUTES = ["/api/auth/login"];
const PUBLIC_PAGES_ROUTES = ["/login"];
const UNAUTHENTICATED_ONLY_PAGES = [
  "/login",
  // "/register", "/forgot-password", etc.
];

export const config = {
  matcher: [
    "/((?!_next|static|favicon.ico).*)",
  ],
};

/*
 * TODO: Refactor this proxy.
 * Reason: new functionalities were added and the code is becoming large
 * and hard to maintain. Separating responsibilities.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  const authResult = authenticate(request);
  const isAuthenticated = !('response' in authResult);

  if (
    isAuthenticated &&
    UNAUTHENTICATED_ONLY_PAGES.includes(pathname)
  ) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  const isPublicPath =
    PUBLIC_PAGES_ROUTES.includes(pathname) ||
    PUBLIC_API_ROUTES.includes(pathname)

  if (isPublicPath) {
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    return authResult.response;
  }

  const { user } = authResult;
  const authorizationResponse = authorizeByRole(pathname, user);
  if (authorizationResponse) {
    return authorizationResponse;
  }

  const response = NextResponse.next();
  response.headers.set("x-user-id", user.id);
  response.headers.set("x-user-role", user.role);
  response.headers.set("x-user-username", user.username);
  return response;
}