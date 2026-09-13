import type {
  EssayStatsWithoutGlobal,
  GetAuthorEssaysStatsQuery,
} from '@/src/core/application/use-cases/essay';
import type { Mapper } from '@/src/core/domain/contracts/mappers';
import {
  type EssayAggregateResult,
  essayAggregateArgs,
} from '@/src/core/infrastructure/databases/prisma/selects';
import type { PrismaClient } from '@/src/generated/prisma/client';

type PrismaGetAuthorEssaysStatsQueryDeps = {
  prisma: PrismaClient;
  mapper: Mapper<EssayAggregateResult, EssayStatsWithoutGlobal>;
};

export class PrismaGetAuthorEssaysStatsQuery implements GetAuthorEssaysStatsQuery {
  private readonly prisma: PrismaClient;
  private readonly mapper: Mapper<
    EssayAggregateResult,
    EssayStatsWithoutGlobal
  >;

  constructor({ prisma, mapper }: PrismaGetAuthorEssaysStatsQueryDeps) {
    this.prisma = prisma;
    this.mapper = mapper;
  }

  async execute(userId: string): Promise<EssayStatsWithoutGlobal> {
    const result = await this.prisma.essay.aggregate({
      where: {
        authorId: userId,
      },
      ...essayAggregateArgs,
    });

    return this.mapper.map(result);
  }
}
