import { authorizeByRole } from "./utils";
import { Middleware } from "@/src/middlewares/middleware.interface";
import { Role } from "@/src/core/domain/auth/roles";

export const RoleMiddleware: Middleware = async (request) => {
  const { pathname } = request.nextUrl;

  const headers = request.headers;
  const userId = headers.get("x-user-id") as string;
  const userRole = headers.get("x-user-role") as Role;
  const userUsername = headers.get("x-user-username") as string;

  const authorizationResponse = authorizeByRole(pathname, {
    id: userId,
    role: userRole,
    username: userUsername
  });
  if (authorizationResponse) {
    return authorizationResponse;
  }

  return null;
};