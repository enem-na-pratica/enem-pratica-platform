import { NextRequest } from "next/server";
import { Role, hasAtLeastRole, ROLES } from "@/src/core/domain/auth/roles";

const PROTECTED_ROUTES_MAP: Record<string, Role> = {
  "/user/new": ROLES.ADMIN,
  "/dashboard/content/": ROLES.TEACHER,
  "/dashboard/to-be-reviewed/": ROLES.TEACHER,
  "/dashboard/review/": ROLES.TEACHER,
  "/dashboard/simulations/": ROLES.TEACHER,
  "/dashboard/essays/": ROLES.TEACHER,
  "/api/teaching-staff/": ROLES.ADMIN,
  "/api/user/new": ROLES.ADMIN,
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