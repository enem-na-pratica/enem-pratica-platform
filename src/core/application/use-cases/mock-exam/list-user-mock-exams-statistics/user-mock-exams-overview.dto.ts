import type { MockExamDto } from '@/src/core/application/common/dtos';
import type { KnowledgeAreaLabelKey } from '@/src/core/domain/entities';

export type AreaSummaryDto = {
  averagePerformanceRate: number;
  averageCorrectAnswers: number;
  totalCriticalErrors: number;
};

export type MockExamStatisticsDto = {
  totalMockExams: number;

  globalAveragePerformance: number;

  performancePerArea: Record<KnowledgeAreaLabelKey, AreaSummaryDto>;

  errorPrevalence: {
    distractionAverage: number;
    interpretationAverage: number;
    knowledgeGapAverage: number;
  };
};

export type UserMockExamsOverviewDto = {
  statistics: MockExamStatisticsDto;
  mockExams: MockExamDto[];
};
