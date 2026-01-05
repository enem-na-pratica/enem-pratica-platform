import { NextResponse, NextRequest } from "next/server";
import { makeGetCurrentUserController } from "@/src/core/main/factories/user/get-current-user.factory";

export async function GET(request: NextRequest) {
  const userUsername = request.headers.get("x-user-username") as string;

  const getCurrentUserController = await makeGetCurrentUserController().handle({
    body: {
      username: userUsername
    }
  });

  return NextResponse.json(
    getCurrentUserController.body,
    { status: getCurrentUserController.statusCode }
  );
}