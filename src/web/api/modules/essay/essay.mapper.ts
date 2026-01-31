import type { EssayDto, UserEssaysOverviewDto } from './essay.dto';
import type { Essay, UserEssaysOverview } from './essay.model';

export const EssayMapper = {
  toModel(dto: EssayDto): Essay {
    return {
      id: dto.id,
      authorId: dto.authorId,
      theme: dto.theme,
      grades: { ...dto.grades },
      createdAt: new Date(dto.createdAt),
    };
  },

  toOverviewModel(dto: UserEssaysOverviewDto): UserEssaysOverview {
    return {
      statistics: { ...dto.statistics },
      essays: dto.essays.map((essayDto) => EssayMapper.toModel(essayDto)),
    };
  }
};