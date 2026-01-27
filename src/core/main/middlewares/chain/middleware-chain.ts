import { NextRequest, NextResponse } from "next/server";
import type { Middleware } from "@/src/core/main/middlewares/interfaces";

export async function createMiddlewareChain(
  request: NextRequest,
  middlewares: Middleware[],
): Promise<NextResponse | null> {
  for (const middleware of middlewares) {
    const response = await middleware(request);
    if (response) {
      return response;
    }
  }

  return null;
}