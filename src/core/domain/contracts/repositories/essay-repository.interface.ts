import type { Essay } from "@/src/core/domain/entities/essay.entity";

export interface EssayRepository {
  create(essay: Essay): Promise<Essay>;
}