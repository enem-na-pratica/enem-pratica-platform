import type { KnowledgeArea } from '@/src/core/domain/entities';
import type { KnowledgeAreaLabelKey } from '@/src/core/domain/entities';

export type AreaAggregateRaw = {
  area: KnowledgeArea;
  count: number;
  sumCorrectCount: number;
  sumDoubtErrors: number;
  sumDistractionErrors: number;
  sumInterpretationErrors: number;
};

export type MockExamsRawAggregate = {
  totalMockExams: number;
  areaAggregates: AreaAggregateRaw[];
};

export type AreaSummaryDto = {
  averagePerformanceRate: number;
  averageCorrectAnswers: number;
  totalCriticalErrors: number;
};

export type MockExamStatsDto = {
  totalMockExams: number;
  globalAveragePerformance: number;
  performancePerArea: Record<KnowledgeAreaLabelKey, AreaSummaryDto>;
  errorPrevalence: {
    distractionAverage: number;
    interpretationAverage: number;
    knowledgeGapAverage: number;
  };
};
