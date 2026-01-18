import { EssayResDto } from "./essay.res.dto";

type CompetencyKey = "c1" | "c2" | "c3" | "c4" | "c5";

type EssaySummary = {
  totalCount: number;
  globalAverage: number;
  averagesPerCompetency: Record<CompetencyKey, number>;
};

export type EssaysResponse = {
  summary: EssaySummary;
  data: EssayResDto[];
};