import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareChain } from "./middlewares/middleware-chain";
import { AuthMiddleware } from "./middlewares/auth.middleware";
import { RoleMiddleware } from "./middlewares/role.middleware";

export const config = {
  matcher: [
    "/((?!_next|static|favicon.ico|access-denied).*)",
  ],
};

const middlewares = [
  AuthMiddleware,
  RoleMiddleware,
];

export async function proxy(request: NextRequest) {
  const response = await createMiddlewareChain(request, middlewares);

  if (response) {
    return response;
  }

  return NextResponse.next();
}