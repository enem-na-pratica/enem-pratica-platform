import { EssayResponseDto } from "@/src/services/api/dtos";
import { EssayModel } from "@/src/services/api/models";
import { Mapper } from "@/src/services/api/common/interfaces";

export class EssayMapper implements Mapper<EssayResponseDto, EssayModel> {
  toModel(response: EssayResponseDto): EssayModel {
    return {
      id: response.id,
      authorId: response.authorId,
      theme: response.theme,
      grades: {
        c1: response.grades.c1,
        c2: response.grades.c2,
        c3: response.grades.c3,
        c4: response.grades.c4,
        c5: response.grades.c5,
        total: response.grades.total,
      },
      createdAt: new Date(response.createdAt),
    };
  }
}