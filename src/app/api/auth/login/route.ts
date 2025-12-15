import { makeLoginController } from "@/src/core/main/factories/auth/login.factory";
import { CookieData } from "@/src/core/presentation/interfaces";
import { NextResponse, NextRequest } from "next/server";


export async function POST(request: NextRequest) {
  let credentials;

  try {
    if (request.headers.get("content-type")?.includes("application/json")) {
      credentials = await request.json();
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid or malformed JSON request body." },
      { status: 400 }
    );
  }

  const loginController = await makeLoginController().handle({ body: credentials });

  if (loginController.statusCode !== 204) {
    return NextResponse.json(
      loginController.body,
      { status: loginController.statusCode }
    );
  }

  const response = new NextResponse(
    loginController.body,
    { status: loginController.statusCode }
  );

  if (loginController.cookies) {
    loginController.cookies.forEach((cookie: CookieData) => {
      response.cookies.set(
        cookie.name,
        cookie.value,
        cookie.options
      );
    });
  }

  return response;
}