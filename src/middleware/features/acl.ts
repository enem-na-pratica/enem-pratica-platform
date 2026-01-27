import { NextResponse, type NextRequest } from "next/server";
import { type Role, hasAtLeastRole } from "@/src/core/domain/auth";
import { ACL_RULES, ROUTES } from "../config";
import type { MiddlewareHandler } from "../types";

export const aclMiddleware: MiddlewareHandler = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;

  // AuthMiddleware is expected to have already injected this header.
  const userRole = request.headers.get("x-user-role") as Role;

  // If no role is present (e.g. unauthenticated user on a public route),
  // ACL rules do not apply.
  if (!userRole) return null;

  const rule = ACL_RULES.find((r) => pathname.startsWith(r.path));

  if (rule) {
    const isAuthorized = hasAtLeastRole(rule.minRole, userRole);

    if (!isAuthorized) {
       // API routes return JSON errors instead of redirects.
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Forbidden: Insufficient permissions." },
          { status: 403 }
        );
      }

      // Page routes are redirected to an access denied screen.
      return NextResponse.redirect(new URL(ROUTES.ACCESS_DENIED_PATH, request.url));
    }
  }

  return null;
};