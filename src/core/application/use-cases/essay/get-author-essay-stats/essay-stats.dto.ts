import type { Grades } from '@/src/core/domain/value-objects';

export type EssayStatsDto = {
  totalCount: number;
  globalAverage: number;
  averagesPerCompetency: Grades;
};
