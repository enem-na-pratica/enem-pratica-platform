import { makeLoginController } from "@/src/core/main/factories/auth/login.factory";
import { NextResponse, NextRequest } from "next/server";


export async function POST(request: NextRequest) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Body inválido ou vazio." },
      { status: 400 }
    );
  }

  const loginController = await makeLoginController().handle({ body });

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