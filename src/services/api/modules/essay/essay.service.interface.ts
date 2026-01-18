import { EssayModel } from "@/src/services/api/models";

export interface EssayServiceHttp {
  create(dataEssay: unknown): Promise<EssayModel>;
}