import type {
  AreaAggregateRaw,
  MockExamsRawAggregate,
} from '@/src/core/application/use-cases/mock-exam';
import type { Mapper } from '@/src/core/domain/contracts/mappers';
import type { MockExamRawAggregateResult } from '@/src/core/infrastructure/databases/prisma/contracts/aggregates';

export class PrismaMockExamsRawAggregateMapper implements Mapper<
  MockExamRawAggregateResult,
  MockExamsRawAggregate
> {
  map(input: MockExamRawAggregateResult): MockExamsRawAggregate {
    const areaAggregates: AreaAggregateRaw[] = input.groupedByArea.map(
      (group) => ({
        area: group.area,
        count: group._count._all,
        sumCorrectCount: group._sum.correctCount ?? 0,
        sumDoubtErrors: group._sum.doubtErrors ?? 0,
        sumDistractionErrors: group._sum.distractionErrors ?? 0,
        sumInterpretationErrors: group._sum.interpretationErrors ?? 0,
      }),
    );

    return {
      totalMockExams: input.totalMockExams,
      areaAggregates,
    };
  }
}
