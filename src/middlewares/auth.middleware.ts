import { NextResponse } from "next/server";
import { authenticate } from "@/src/middlewares/utils";
import { Middleware } from "@/src/middlewares/middleware.interface";

const UNAUTHENTICATED_ONLY_PAGES = [
  "/login",
  // "/register", "/forgot-password", etc.
];

export const AuthMiddleware: Middleware = async (request) => {
  const { pathname } = request.nextUrl;
  const authResult = authenticate(request);
  const isAuthenticated = !('response' in authResult);

  if (
    isAuthenticated &&
    UNAUTHENTICATED_ONLY_PAGES.includes(pathname)
  ) {
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = '/dashboard';
    return NextResponse.redirect(newUrl);
  }

  if (!isAuthenticated) {
    return authResult.response;
  }

  const { user } = authResult;
  request.headers.set("x-user-id", user.id);
  request.headers.set("x-user-role", user.role);
  request.headers.set("x-user-username", user.username);

  return null;
};