import { EssayModel } from "./essay.model";
import { EssaySummary } from "@/src/services/api/dtos";

export type EssaysModel = {
  summary: EssaySummary;
  data: EssayModel[];
};