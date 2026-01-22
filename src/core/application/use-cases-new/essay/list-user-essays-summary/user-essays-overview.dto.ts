import type { EssayDto } from "@/src/core/application/common/dtos";

export type CompetencyKey = `c${1 | 2 | 3 | 4 | 5}`;

export type EssayStatisticsDto = {
  totalCount: number;
  globalAverage: number;
  averagesPerCompetency: Record<CompetencyKey, number>;
};

export type UserEssaysOverviewDto = {
  statistics: EssayStatisticsDto;
  essays: EssayDto[];
};
