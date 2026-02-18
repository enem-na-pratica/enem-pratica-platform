import type { KnowledgeArea } from '@/src/web/config';

export type AreaPerformance = {
  id: string;
  area: KnowledgeArea;
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

export type KnowledgeAreaLabelKey =
  | 'languages'
  | 'humanities'
  | 'naturalSciences'
  | 'mathematics';

export type MockExam = {
  id: string;
  authorId: string;
  title: string;
  performances: Record<KnowledgeAreaLabelKey, AreaPerformance>;
  createdAt: Date;
};

type AreaSummary = {
  averagePerformanceRate: number;
  averageCorrectAnswers: number;
  totalCriticalErrors: number;
};

export type MockExamStatistics = {
  totalMockExams: number;

  globalAveragePerformance: number;

  performancePerArea: Record<KnowledgeAreaLabelKey, AreaSummary>;

  errorPrevalence: {
    distractionAverage: number;
    interpretationAverage: number;
    knowledgeGapAverage: number;
  };
};

export type UserMockExamsOverview = {
  statistics: MockExamStatistics;
  mockExams: MockExam[];
};
