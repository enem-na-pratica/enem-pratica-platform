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
    }
  }
}