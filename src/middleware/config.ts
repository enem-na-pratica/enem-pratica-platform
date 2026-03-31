import { type Role, ROLES } from "@/src/core/domain/auth";
import { URLPattern } from "next/server";

export const ROUTES = {
  GUEST_ONLY: ["/login", "/register"],
  PUBLIC: ["/", "/about", "/contact"],
  LOGIN_PATH: "/login",
  ACCESS_DENIED_PATH: "/access-denied",
  DASHBOARD_HOME: "/dashboard",
};

export const AUTH_COOKIE_NAME = "auth_token";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// Order matters: more specific paths must come before more generic ones.
export const ACL_RULES: Array<{
  pattern: URLPattern;
  minRole: Role;
  methods?: HttpMethod[];
}> = [
    {
      pattern: new URLPattern({ pathname: "/api/users/:username/students" }),
      minRole: ROLES.TEACHER,
    },
    {
      pattern: new URLPattern({ pathname: "/api/users" }),
      methods: ["GET"],
      minRole: ROLES.TEACHER
    },
    {
      pattern: new URLPattern({ pathname: "/api/users" }),
      methods: ["POST"],
      minRole: ROLES.ADMIN
    },
    {
      pattern: new URLPattern({ pathname: "/users/new" }),
      minRole: ROLES.ADMIN
    },
    {
      pattern: new URLPattern({
        pathname: "/dashboard/:folder(content|essays|review|simulations|to-be-reviewed)/:rest+"
      }),
      minRole: ROLES.TEACHER
    },
  ];
