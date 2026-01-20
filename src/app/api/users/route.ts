import { Role } from "@/src/core/domain/auth";
import { makeListUsersController } from "@/src/core/main/factories/user/list-users.factory";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const userRole = request.headers.get("x-user-role") as Role;

  const listUsersController = await makeListUsersController().handle({
    body: { role: userRole }
  });

  return NextResponse.json(
    listUsersController.body,
    { status: listUsersController.statusCode }
  );
}