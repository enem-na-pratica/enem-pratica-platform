import { FindAllByAuthorUseCase } from "@/src/core/application/use-cases/essay/find-all-by-author.use-case";
import {
  makePrismaEssayRepository
} from "@/src/core/main/factories/repositories";
import { EssayResDtoMapper } from "@/src/core/application/mapper/essay-dto.mapper";
import { FindEssaysByAuthorController } from "@/src/core/presentation/controllers/essay/list-essays-by-author.controller";

export function makeFindEssaysByAuthorController() {
  const prismaEssayRepository = makePrismaEssayRepository();
  const mapper = new EssayResDtoMapper();

  const findAllByAuthorUseCase = new FindAllByAuthorUseCase({
    essayRepository: prismaEssayRepository,
    mapper
  })

  return new FindEssaysByAuthorController({
    findAllByAuthorUseCase
  })
}
