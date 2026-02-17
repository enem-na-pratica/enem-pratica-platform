export type AreaPerformanceDto = {
  id: string;
  area: string;
  statistics: {
    overallResult: {
      totalQuestions: number;
      correctAnswers: number;
      wrongAnswers: number;
      performanceRate: number;
    };
    qualityAssessment: {
      certaintyHits: number;
      confidenceRate: number;
      doubtHits: number;
      doubtErrors: number;
      criticalErrors: number;
    };
    errorAnalysis: {
      distractionErrors: number;
      interpretationErrors: number;
      knowledgeGaps: number;
    };
  };
};

type KnowledgeAreaLabelKey =
  | 'languages'
  | 'humanities'
  | 'naturalSciences'
  | 'mathematics';

export type MockExamDto = {
  id: string;
  authorId: string;
  title: string;
  performances: Record<KnowledgeAreaLabelKey, AreaPerformanceDto>;
  createdAt: string;
};

type AreaSummaryDto = {
  averagePerformanceRate: number;
  averageCorrectAnswers: number;
  totalCriticalErrors: number;
};

type MockExamStatisticsDto = {
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
