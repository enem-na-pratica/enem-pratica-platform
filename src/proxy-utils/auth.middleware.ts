import { NextRequest, NextResponse } from "next/server";
import { Role } from "@/src/core/domain/auth/roles";
import { JwtTokenAdapter } from "@/src/core/infrastructure/criptography/jwt.adapter";

const LOGIN_PATH = "/login";
const AUTH_COOKIE_NAME = "auth_token";

// It repeats, center it.
interface TokenPayload {
  id: string;
  username: string;
  role: Role;
}

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