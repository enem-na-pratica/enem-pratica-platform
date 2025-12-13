import { NextRequest, NextResponse } from "next/server";
import { authenticate, authorizeByRole } from "@/src/proxy-utils";

const PUBLIC_API_ROUTES = ["/api/auth/login"];
const PUBLIC_PAGES_ROUTES = ["/login"];

export const config = {
  matcher: [
    "/((?!_next|static|favicon.ico).*)",
  ],
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath =
    PUBLIC_PAGES_ROUTES.includes(pathname) ||
    PUBLIC_API_ROUTES.includes(pathname)

  if (isPublicPath) {
    return NextResponse.next();
  }

  const authResult = authenticate(request);
  if ('response' in authResult) {
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