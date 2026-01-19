import { EssayModel, EssaysModel } from "@/src/services/api/models";

export interface EssayServiceHttp {
  create(dataEssay: unknown): Promise<EssayModel>;
  listMyEssays(): Promise<EssaysModel>;
}