import { NextResponse, NextRequest } from "next/server";
import { Role } from "@/src/core/domain/auth/roles";
import { makeCreateEssayController } from "@/src/core/main/factories/essay/create-user.factory";

export async function POST(request: NextRequest) {
  const userId = request.headers.get("x-user-id")!;
  const userRole = request.headers.get("x-user-role")! as Role;
  const body = await request.json();

  const createEssayController = await makeCreateEssayController().handle({
    body: {
      requesterId: userId,
      requesterRole: userRole,
      essayData: {
        authorId: body.authorId,
        theme: body.theme,
        competency1: body.competency1,
        competency2: body.competency2,
        competency3: body.competency3,
        competency4: body.competency4,
        competency5: body.competency5,
      }
    }
  });

  return NextResponse.json(
    createEssayController.body,
    { status: createEssayController.statusCode }
  );
}