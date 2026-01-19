import { NextResponse, NextRequest } from "next/server";
import { makeFindEssaysByAuthorController } from "@/src/core/main/factories/essay/list-essays-by-author.factory";

export async function GET(request: NextRequest) {
  const userId = request.headers.get("x-user-id")!;

  const findEssaysByAuthorController = await makeFindEssaysByAuthorController().handle({
    body: {
      authorId: userId
    }
  });

  return NextResponse.json(
    findEssaysByAuthorController.body,
    { status: findEssaysByAuthorController.statusCode }
  );
}