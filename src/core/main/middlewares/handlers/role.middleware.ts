import { NextResponse } from "next/server";
import { roleGuard } from "@/src/core/main/middlewares/guards";
import type { Middleware } from "@/src/core/main/middlewares/interfaces";

export const RoleMiddleware: Middleware = async (request) => {
  const pathname = request.nextUrl.pathname;
  const isAuthorized = roleGuard(request);

  if (!isAuthorized) {
    // If API
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "You do not have permission to access this resource.", },
        { status: 403 }
      );
    }

    // If page
    const url = request.nextUrl.clone();
    url.pathname = "/access-denied";
    return NextResponse.redirect(url);
  }

  return null;
};