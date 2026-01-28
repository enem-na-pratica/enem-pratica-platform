import { type Role, ROLES } from "@/src/core/domain/auth";

export const ROUTES = {
  GUEST_ONLY: ["/login", "/register"],
  PUBLIC: ["/", "/about", "/contact"],
  LOGIN_PATH: "/login",
  ACCESS_DENIED_PATH: "/access-denied",
  DASHBOARD_HOME: "/dashboard",
};

export const AUTH_COOKIE_NAME = "auth_token";

// Order matters: more specific paths must come before more generic ones.
export const ACL_RULES: Array<{ path: string; minRole: Role }> = [
  { path: "/user/new", minRole: ROLES.ADMIN },
  { path: "/api/teaching-staff", minRole: ROLES.ADMIN },
  { path: "/api/users/new", minRole: ROLES.ADMIN },
  { path: "/dashboard/content/", minRole: ROLES.TEACHER },
  { path: "/dashboard/essays/", minRole: ROLES.TEACHER },
  { path: "/dashboard/review/", minRole: ROLES.TEACHER },
  { path: "/dashboard/simulations/", minRole: ROLES.TEACHER },
  { path: "/dashboard/to-be-reviewed/", minRole: ROLES.TEACHER },
];