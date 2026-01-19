import { EssaysResponse } from "@/src/core/application/dtos/essay";

export interface FindAllByAuthor {
  execute(authorId: string): Promise<EssaysResponse>;
}