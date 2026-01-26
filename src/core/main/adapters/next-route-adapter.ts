/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import {
  Controller,
  HttpRequest,
  AuthenticatedRequest
} from "@/src/core/presentation/protocols";
import { Role } from "@/src/core/domain/auth";

type RouteContext = {
  params: Promise<Record<string, string | string[]>>;
};

export const nextRouteAdapter = (controller: Controller<any, any>) => {
  return async (request: NextRequest, context: RouteContext) => {
    let body = {};
    try {
      if (request.headers.get("content-length") !== "0") {
        body = await request.json();
      }
    } catch { }

    const query: Record<string, string | string[]> = {};
    request.nextUrl.searchParams.forEach((_, key) => {
      const values = request.nextUrl.searchParams.getAll(key);
      if (values.length > 1) {
        query[key] = values;
      } else {
        query[key] = values[0];
      }
    });

    const params = await context.params;

    const httpRequest: HttpRequest = {
      body,
      params,
      query,
    };

    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");
    const username = request.headers.get("x-user-username");

    if (userId && userRole && username) {
      (httpRequest as AuthenticatedRequest).requester = {
        id: userId,
        role: userRole as Role,
        username: username,
      };
    }

    const httpResponse = await controller.handle(httpRequest);

    let response: NextResponse;

    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      if (httpResponse.statusCode === 204) {
        response = new NextResponse(null, {
          status: 204,
        });
      } else {
        response = NextResponse.json(httpResponse.body, {
          status: httpResponse.statusCode,
        });
      }
    } else {
      response = NextResponse.json(
        { error: httpResponse.body },
        { status: httpResponse.statusCode }
      );
    }

    if (httpResponse.cookies) {
      httpResponse.cookies.forEach((cookie) => {
        response.cookies.set({
          name: cookie.name,
          value: cookie.value,
          ...cookie.options,
          sameSite: cookie.options.sameSite as "strict" | "lax" | "none",
        });
      });
    }

    return response;
  };
};