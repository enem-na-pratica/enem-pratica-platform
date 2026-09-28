type KnowledgeAreaLabelKey =
  | 'languages'
  | 'humanities'
  | 'naturalSciences'
  | 'mathematics';

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
      knowledgeGapsErrors: number;
    };
  };
};

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
