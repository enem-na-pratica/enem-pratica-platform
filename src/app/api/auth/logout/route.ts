import { makeLogoutController } from "@/src/core/main/factories/auth/logout.factory";
import { HttpRequest } from "@/src/core/presentation/interfaces";
import { NextResponse, NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "auth_token";

export async function DELETE(request: NextRequest) {
  const controllerResponse = await makeLogoutController().handle({} as HttpRequest);

  if (controllerResponse.statusCode !== 204) {
    return NextResponse.json(
      controllerResponse.body,
      { status: controllerResponse.statusCode }
    );
  }

  const response = new NextResponse(
    controllerResponse.body,
    { status: controllerResponse.statusCode }
  );

  response.cookies.delete(AUTH_COOKIE_NAME);

  return response;
}