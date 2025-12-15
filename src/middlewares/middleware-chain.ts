import { NextRequest, NextResponse } from "next/server";
import { Middleware } from "@/src/middlewares/middleware.interface";

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