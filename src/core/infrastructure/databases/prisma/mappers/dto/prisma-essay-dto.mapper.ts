import type { Mapper } from "@/src/core/domain/contracts/mappers";
import type { EssayDto } from "@/src/core/application/common/dtos";
import type { Essay as PrismaEssay } from "@/src/generated/prisma/client";

export class PrismaEssayDtoMapper implements Mapper<PrismaEssay, EssayDto> {
  public map(essay: PrismaEssay): EssayDto {
    return {
      id: essay.id,
      authorId: essay.authorId,
      theme: essay.theme,
      grades: {
        c1: essay.competency1,
        c2: essay.competency2,
        c3: essay.competency3,
        c4: essay.competency4,
        c5: essay.competency5,
        total: essay.competency1 +
          essay.competency2 +
          essay.competency3 +
          essay.competency4 +
          essay.competency5,
      },
      createdAt: essay.createdAt.toISOString(),
    };
  }
}
