import { CreateEssayDto, EssayResDto } from "@/src/core/application/dtos/essay";

export interface CreateEssay {
  execute(request: CreateEssayDto): Promise<EssayResDto>;
}