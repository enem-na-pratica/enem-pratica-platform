import { makeLoginController } from "@/src/core/main/factories/auth/login.factory";
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

  const response = NextResponse.json(
    loginController.body.user,
    { status: loginController.statusCode }
  );

  response.cookies.set(
    "auth_token",
    loginController.body.accessToken,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "strict",
    }
  );

  return response;
}