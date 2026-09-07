import type { KnowledgeAreaLabelKey } from '@/src/web/api';

export type AreaInputValues = {
  correctCount: number;
  certaintyCount: number;
  doubtErrors: number;
  distractionErrors: number;
  interpretationErrors: number;
};

export type AreaCalculatedValues = {
  wrongAnswers: number;
  performanceRate: number;
  doubtHits: number;
  confidenceRate: number;
  criticalErrors: number;
  knowledgeGaps: number;
};

const PERCENTAGE_MULTIPLIER = 100;

export function calculateAreasStats(
  areas: { key: KnowledgeAreaLabelKey }[],
  watchedAreas: Record<KnowledgeAreaLabelKey, AreaInputValues>,
  totalQuestionsPerArea: number,
): Record<KnowledgeAreaLabelKey, AreaCalculatedValues> {
  return areas.reduce(
    (acc, { key }) => {
      acc[key] = calculateAreaStats(watchedAreas[key], totalQuestionsPerArea);
      return acc;
    },
    {} as Record<KnowledgeAreaLabelKey, AreaCalculatedValues>,
  );
}

// Aligned with AreaPerformance entity logic
function calculateAreaStats(
  input: AreaInputValues,
  totalQuestionsPerArea: number,
): AreaCalculatedValues {
  const {
    correctCount,
    certaintyCount,
    doubtErrors,
    distractionErrors,
    interpretationErrors,
  } = input;

  const wrongAnswers = totalQuestionsPerArea - correctCount;

  const performanceRate =
    (correctCount / totalQuestionsPerArea) * PERCENTAGE_MULTIPLIER;

  const doubtHits = correctCount - certaintyCount;

  const confidenceRate =
    correctCount > 0
      ? (certaintyCount / correctCount) * PERCENTAGE_MULTIPLIER
      : 0;

  const criticalErrors = Math.max(0, wrongAnswers - doubtErrors);

  const knowledgeGaps = Math.max(
    0,
    wrongAnswers - distractionErrors - interpretationErrors,
  );

  return {
    wrongAnswers,
    performanceRate,
    doubtHits,
    confidenceRate,
    criticalErrors,
    knowledgeGaps,
  };
}
