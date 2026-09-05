import type { KnowledgeAreaLabelKey, MockExam } from '@/src/web/api';

export const AREA_KEYS: KnowledgeAreaLabelKey[] = [
  'languages',
  'humanities',
  'naturalSciences',
  'mathematics',
];

export type MockExamTotals = {
  totalCorrect: number;
  totalWrong: number;
  totalCertainty: number;
  totalDoubtHit: number;
  totalDoubtError: number;
  totalCritical: number;
  totalDistraction: number;
  totalInterpretation: number;
  totalKnowledge: number;
};

const INITIAL_TOTALS: MockExamTotals = {
  totalCorrect: 0,
  totalWrong: 0,
  totalCertainty: 0,
  totalDoubtHit: 0,
  totalDoubtError: 0,
  totalCritical: 0,
  totalDistraction: 0,
  totalInterpretation: 0,
  totalKnowledge: 0,
};

export function calculateMockExamTotals(mock: MockExam): MockExamTotals {
  return AREA_KEYS.reduce(
    (acc, key) => {
      const stats = mock.performances[key].statistics;

      acc.totalCorrect += stats.overallResult.correctAnswers;
      acc.totalWrong += stats.overallResult.wrongAnswers;
      acc.totalCertainty += stats.qualityAssessment.certaintyHits;
      acc.totalDoubtHit += stats.qualityAssessment.doubtHits;
      acc.totalDoubtError += stats.qualityAssessment.doubtErrors;
      acc.totalCritical += stats.qualityAssessment.criticalErrors;
      acc.totalDistraction += stats.errorAnalysis.distractionErrors;
      acc.totalInterpretation += stats.errorAnalysis.interpretationErrors;
      acc.totalKnowledge += stats.errorAnalysis.knowledgeGapsErrors;

      return acc;
    },
    { ...INITIAL_TOTALS },
  );
}
