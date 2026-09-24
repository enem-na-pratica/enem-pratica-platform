import type { Prisma } from '@/src/generated/prisma/client';

export const areaPerformanceGroupByArgs = {
  by: ['area'],
  _count: { _all: true },
  _sum: {
    correctCount: true,
    doubtErrors: true,
    distractionErrors: true,
    interpretationErrors: true,
  },
} satisfies Prisma.AreaPerformanceGroupByArgs;

type AreaPerformanceGroupByResult = Awaited<
  Prisma.GetAreaPerformanceGroupByPayload<typeof areaPerformanceGroupByArgs>
>;

export type MockExamRawAggregateResult = {
  totalMockExams: number;
  groupedByArea: AreaPerformanceGroupByResult;
};
