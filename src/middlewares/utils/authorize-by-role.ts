import { NextRequest } from "next/server";
import { Role, hasAtLeastRole, ROLES } from "@/src/core/domain/auth/roles";

// Fictitious routes; implement real routes as they are developed.
const PROTECTED_ROUTES_MAP: Record<string, Role> = {
  "/api/admin": ROLES.ADMIN,
  "/api/admin/users": ROLES.ADMIN,
  "/api/admin/users/config": ROLES.SUPERADMIN,
  "/dashboard/grades": ROLES.TEACHER,
};

const RULES = Object.entries(PROTECTED_ROUTES_MAP).sort(
  ([pathA], [pathB]) => pathB.length - pathA.length
);

export function isAuthorizedByRole(request: NextRequest): boolean {
  const pathname = request.nextUrl.pathname;
  const userRole = request.headers.get("x-user-role") as Role;

  const directMatchRole = PROTECTED_ROUTES_MAP[pathname];
  if (directMatchRole) {
    return hasAtLeastRole(directMatchRole, userRole);
  }

  const rule = RULES.find(([path]) => pathname.startsWith(path));

  if (rule) {
    const [, minRole] = rule;
    return hasAtLeastRole(minRole, userRole);
  }

  return true;
}