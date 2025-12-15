import { NextRequest, NextResponse } from "next/server";
import { JwtTokenAdapter } from "@/src/core/infrastructure/criptography/jwt.adapter";
import { TokenPayload } from "@/src/core/domain/shared/interfaces";

const LOGIN_PATH = "/login";
const AUTH_COOKIE_NAME = "auth_token";

const jwtAdapter = new JwtTokenAdapter<TokenPayload>(
  process.env.JWT_SECRET || "fallback_secret",
  '7d'
);

export function authenticate(
  request: NextRequest
): { user: TokenPayload } | { response: NextResponse } {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return { response: NextResponse.redirect(new URL(LOGIN_PATH, request.url)) };
  }

  try {
    const userPayload = jwtAdapter.verify(token);
    return { user: userPayload };
  } catch {
    const response = NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    response.cookies.delete(AUTH_COOKIE_NAME);
    return { response };
  }
}