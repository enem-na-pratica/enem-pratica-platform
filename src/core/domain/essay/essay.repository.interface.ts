import { Essay } from "@/src/core/domain/essay/essay.entity";

export interface EssayRepository {
  create(essay: Essay): Promise<Essay>;
}