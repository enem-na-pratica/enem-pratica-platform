import type { NextRequest } from "next/server";
import type { MiddlewareHandler, MiddlewareResult } from "./types";

export async function executeMiddlewareChain(
  request: NextRequest,
  middlewares: MiddlewareHandler[]
): Promise<MiddlewareResult> {
  for (const middleware of middlewares) {
    // The same request instance is passed through the chain.
    // Since headers are mutable, changes made by one middleware
    // are visible to the next ones.
    const response = await middleware(request);

    // If a middleware returns a response (redirect or error),
    // the chain execution is short-circuited.
    if (response) {
      return response;
    }
  }

  return null;
}