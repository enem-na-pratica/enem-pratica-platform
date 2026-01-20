import { ToDtoMapper } from "@/src/core/domain/mapper"
import { Essay } from "@/src/core/domain/entities/essay.entity";
import { EssayResDto } from "@/src/core/application/dtos/essay";

export class EssayResDtoMapper implements ToDtoMapper<Essay, EssayResDto> {
  toDto(essay: Essay): EssayResDto {
    if (!essay.id) {
      throw new Error("Cannot map an essay without a valid ID to DTO.");
    }

    return {
      id: essay.id,
      authorId: essay.authorId,
      theme: essay.theme,
      grades: {
        c1: essay.competency1,
        c2: essay.competency2,
        c3: essay.competency3,
        c4: essay.competency4,
        c5: essay.competency5,
        total: essay.totalScore,
      },
      createdAt: essay.createdAt.toISOString(),
    };
  }
}