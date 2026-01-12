import { NextResponse, NextRequest } from "next/server";
import { makeCreateUserController } from "@/src/core/main/factories/user/create-user.factory";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const createUserController = await makeCreateUserController().handle({
    body: {
      name: body.name,
      username: body.username,
      password: body.password,
      role: body.role,
      teacherId: body.teacherId
    }
  });

  return NextResponse.json(
    createUserController.body,
    { status: createUserController.statusCode }
  );
}
