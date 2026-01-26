import type { ListEssaysByAuthorQuery } from "@/src/core/application/use-cases/essay/list-user-essays-summary";
import type { Mapper } from "@/src/core/domain/contracts/mappers";
import type { EssayDto } from "@/src/core/application/common/dtos";
import type { PrismaClient, Essay as PrismaEssay } from "@/src/generated/prisma/client";

type PrismaListEssaysByAuthorQueryDeps = {
  prisma: PrismaClient;
  mapper: Mapper<PrismaEssay, EssayDto>;
};

export class PrismaListEssaysByAuthorQuery implements ListEssaysByAuthorQuery {
  private readonly prisma: PrismaClient;
  private readonly mapper: Mapper<PrismaEssay, EssayDto>;

  constructor({ prisma, mapper }: PrismaListEssaysByAuthorQueryDeps) {
    this.prisma = prisma;
    this.mapper = mapper;
  }

  async execute(authorId: string): Promise<EssayDto[]> {
    const essays = await this.prisma.essay.findMany({
      where: {
        authorId: authorId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return essays.map(this.mapper.map);
  }
}