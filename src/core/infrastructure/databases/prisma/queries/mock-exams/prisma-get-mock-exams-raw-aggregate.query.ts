import type {
  GetMockExamsRawAggregateQuery,
  MockExamsRawAggregate,
} from '@/src/core/application/use-cases/mock-exam';
import type { Mapper } from '@/src/core/domain/contracts/mappers';
import {
  type MockExamRawAggregateResult,
  areaPerformanceGroupByArgs,
} from '@/src/core/infrastructure/databases/prisma/contracts/aggregates';
import type { PrismaClient } from '@/src/generated/prisma/client';

type PrismaGetMockExamsRawAggregateQueryDeps = {
  prisma: PrismaClient;
  mapper: Mapper<MockExamRawAggregateResult, MockExamsRawAggregate>;
};

export class PrismaGetMockExamsRawAggregateQuery implements GetMockExamsRawAggregateQuery {
  private readonly prisma: PrismaClient;
  private readonly mapper: Mapper<
    MockExamRawAggregateResult,
    MockExamsRawAggregate
  >;

  constructor({ prisma, mapper }: PrismaGetMockExamsRawAggregateQueryDeps) {
    this.prisma = prisma;
    this.mapper = mapper;
  }

  async execute(authorId: string): Promise<MockExamsRawAggregate> {
    const [totalMockExams, groupedByArea] = await Promise.all([
      this.prisma.mockExam.count({ where: { authorId } }),
      this.prisma.areaPerformance.groupBy({
        where: { mockExam: { authorId } },
        ...areaPerformanceGroupByArgs,
      }),
    ]);

    return this.mapper.map({ totalMockExams, groupedByArea });
  }
}
