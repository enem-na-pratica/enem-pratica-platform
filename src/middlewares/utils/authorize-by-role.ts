import { NextRequest } from "next/server";
import { Role, hasAtLeastRole, ROLES } from "@/src/core/domain/auth/roles";

const ROLE_PROTECTED_ROUTES: { path: string; minRole: Role }[] = [
  { path: "/api/admin/users", minRole: ROLES.ADMIN },
  { path: "/dashboard/grades", minRole: ROLES.TEACHER },
];

export function isAuthorizedByRole(request: NextRequest): boolean {
  const pathname = request.nextUrl.pathname;
  const userRole = request.headers.get("x-user-role") as Role;

  const protectedRoute = ROLE_PROTECTED_ROUTES.find((route) =>
    pathname.startsWith(route.path)
  );

  if (protectedRoute) {
    const requiredRole = protectedRoute.minRole;
    if (!hasAtLeastRole(requiredRole, userRole)) {
      return false;
    }
  }

  return true;
}