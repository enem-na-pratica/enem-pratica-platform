import { Essay } from "@/src/core/domain/entities/essay.entity";
import { ToDomainMapper } from "@/src/core/domain/mapper";
import { Essay as EssayPrisma } from "@/src/generated/prisma/client";

export class PrismaEssayMapper
  implements ToDomainMapper<EssayPrisma, Essay> {
  toDomain(raw: EssayPrisma): Essay {
    return Essay.load({
      id: raw.id,
      authorId: raw.authorId,
      theme: raw.theme,
      competency1: raw.competency1,
      competency2: raw.competency2,
      competency3: raw.competency3,
      competency4: raw.competency4,
      competency5: raw.competency5,
      createdAt: raw.createdAt,
    });
  }
}
