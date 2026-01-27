import { NextRequest, NextResponse } from "next/server";

export type Middleware = (
  request: NextRequest,
) => Promise<NextResponse | null>;