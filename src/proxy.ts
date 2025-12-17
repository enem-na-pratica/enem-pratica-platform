import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareChain } from "./middlewares/middleware-chain";
import { AuthMiddleware } from "./middlewares/auth.middleware";
import { RoleMiddleware } from "./middlewares/role.middleware";

export const config = {
  matcher: [
    "/((?!^$|_next/static|_next/image|favicon.ico|access-denied|api/auth/login|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
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