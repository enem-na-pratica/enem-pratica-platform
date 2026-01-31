import type { EssayDto } from "@/src/core/application/common/dtos";
import type { Grades } from '@/src/core/domain/value-objects';

export type EssayStatisticsDto = {
  totalCount: number;
  globalAverage: number;
  averagesPerCompetency: Grades;
};

export type UserEssaysOverviewDto = {
  statistics: EssayStatisticsDto;
  essays: EssayDto[];
};
