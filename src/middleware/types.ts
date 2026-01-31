import type { NextRequest, NextResponse } from "next/server";

export type MiddlewareResult = NextResponse | null;

export type MiddlewareHandler = (
  request: NextRequest
) => Promise<MiddlewareResult>;