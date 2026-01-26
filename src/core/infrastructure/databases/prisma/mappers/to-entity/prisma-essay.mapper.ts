import { Essay } from "@/src/core/domain/entities";
import { Mapper } from "@/src/core/domain/contracts/mappers";
import { Essay as PrismaEssay } from "@/src/generated/prisma/client";

export class EssayEntityMapper implements Mapper<PrismaEssay, Essay> {
  map(prismaEssay: PrismaEssay): Essay {
    return Essay.load({
      id: prismaEssay.id,
      authorId: prismaEssay.authorId,
      theme: prismaEssay.theme,
      competency1: prismaEssay.competency1,
      competency2: prismaEssay.competency2,
      competency3: prismaEssay.competency3,
      competency4: prismaEssay.competency4,
      competency5: prismaEssay.competency5,
      createdAt: prismaEssay.createdAt,
    });
  }
}
