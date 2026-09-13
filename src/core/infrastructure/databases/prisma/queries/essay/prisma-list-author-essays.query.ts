import type { EssayDto } from '@/src/core/application/common/dtos';
import type { ListAuthorEssaysQuery } from '@/src/core/application/use-cases/essay';
import type { Mapper } from '@/src/core/domain/contracts/mappers';
import type {
  PrismaClient,
  Essay as PrismaEssay,
} from '@/src/generated/prisma/client';

type PrismaListAuthorEssaysQueryDeps = {
  prisma: PrismaClient;
  mapper: Mapper<PrismaEssay, EssayDto>;
};

export class PrismaListAuthorEssaysQuery implements ListAuthorEssaysQuery {
  private readonly prisma: PrismaClient;
  private readonly mapper: Mapper<PrismaEssay, EssayDto>;

  constructor({ prisma, mapper }: PrismaListAuthorEssaysQueryDeps) {
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

    return essays.map((essay) => this.mapper.map(essay));
  }
}
