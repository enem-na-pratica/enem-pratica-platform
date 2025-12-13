import { NextResponse } from "next/server";
import { Role, hasAtLeastRole, ROLES } from "@/src/core/domain/auth/roles";

// It repeats, center it.
interface TokenPayload {
  id: string;
  username: string;
  role: Role;
}

const ROLE_PROTECTED_ROUTES: { path: string; minRole: Role }[] = [
  { path: "/api/admin/users", minRole: ROLES.ADMIN },
  { path: "/dashboard/grades", minRole: ROLES.TEACHER },
];

export function authorizeByRole(
  pathname: string,
  userPayload: TokenPayload,
): NextResponse | null {
  const protectedRoute = ROLE_PROTECTED_ROUTES.find((route) =>
    pathname.startsWith(route.path)
  );

  if (protectedRoute) {
    const requiredRole = protectedRoute.minRole;
    const userRole = userPayload.role;

    if (!hasAtLeastRole(requiredRole, userRole)) {
      // If API
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: `Forbidden: Requires minimum role of ${requiredRole}.`, },
          { status: 403 }
        );
      }

      // If page
      return NextResponse.redirect(new URL("/access-denied", pathname));
    }
  }

  return null; // Access permitted
}