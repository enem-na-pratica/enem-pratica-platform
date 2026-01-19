import { EssayResponseDto } from "./essay-response.dto";

export type CompetencyKey = "c1" | "c2" | "c3" | "c4" | "c5";

export type EssaySummary = {
  totalCount: number;
  globalAverage: number;
  averagesPerCompetency: Record<CompetencyKey, number>;
};

export type EssaysResponse = {
  summary: EssaySummary;
  data: EssayResponseDto[];
};