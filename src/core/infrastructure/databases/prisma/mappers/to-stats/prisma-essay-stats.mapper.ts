import type { EssayStatsWithoutGlobal } from '@/src/core/application/use-cases/essay';
import type { Mapper } from '@/src/core/domain/contracts/mappers';
import type { EssayAggregateResult } from '@/src/core/infrastructure/databases/prisma/contracts/aggregates';

export class PrismaEssayStatsMapper implements Mapper<
  EssayAggregateResult,
  EssayStatsWithoutGlobal
> {
  map(input: EssayAggregateResult): EssayStatsWithoutGlobal {
    if (input._count === 0) return emptyEssayStats;

    return {
      totalCount: input._count,
      averagesPerCompetency: {
        c1: input._avg.competency1!,
        c2: input._avg.competency2!,
        c3: input._avg.competency3!,
        c4: input._avg.competency4!,
        c5: input._avg.competency5!,
      },
    };
  }
}

const emptyEssayStats: EssayStatsWithoutGlobal = {
  totalCount: 0,
  averagesPerCompetency: {
    c1: 0,
    c2: 0,
    c3: 0,
    c4: 0,
    c5: 0,
  },
};
