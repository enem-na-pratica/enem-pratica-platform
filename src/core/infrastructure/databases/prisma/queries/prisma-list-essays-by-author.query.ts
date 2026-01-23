import type { ListEssaysByAuthorQuery } from "@/src/core/application/use-cases/essay/list-user-essays-summary";
import type { EssayDto } from "@/src/core/application/common/dtos";
import type { PrismaClient, Essay as PrismaEssay } from "@/src/generated/prisma/client";

type PrismaListEssaysByAuthorQueryDeps = {
  prisma: PrismaClient;
};

export class PrismaListEssaysByAuthorQuery implements ListEssaysByAuthorQuery {
  private readonly prisma: PrismaClient;

  constructor({ prisma }: PrismaListEssaysByAuthorQueryDeps) {
    this.prisma = prisma;
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

    return essays.map(this.mapToDto);
  }

  private mapToDto(essay: PrismaEssay): EssayDto {
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
        // Manual sum is preferred here over Object.values().reduce() to avoid 
        // unnecessary array allocation and function overhead, ensuring 
        // maximum performance and lower memory footprint.
        total:
          essay.competency1 +
          essay.competency2 +
          essay.competency3 +
          essay.competency4 +
          essay.competency5,
      },
      createdAt: essay.createdAt.toISOString(),
    };
  }
}