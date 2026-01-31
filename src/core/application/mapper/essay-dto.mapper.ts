import { Mapper } from "@/src/core/domain/contracts/mappers/mapper.interface";
import { Essay } from "@/src/core/domain/entities/essay.entity";
import { EssayDto } from "@/src/core/application/common/dtos";

export class EssayDtoMapper implements Mapper<Essay, EssayDto> {
  public map(essay: Essay): EssayDto {
    return {
      id: essay.id!,
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
