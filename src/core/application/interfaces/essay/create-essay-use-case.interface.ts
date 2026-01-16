import { CreateEssayDto, EssayResDto } from "@/src/core/application/dtos/essay";

type CreateEssayDeps = {
  requesterId: string,
  requesterRole: string,
  essayData: CreateEssayDto
}

export interface CreateEssay {
  execute(request: CreateEssayDeps): Promise<EssayResDto>;
}