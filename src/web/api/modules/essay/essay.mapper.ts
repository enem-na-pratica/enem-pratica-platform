import type { EssayDto, EssayStatsDto } from './essay.dto';
import type { Essay, EssayStats } from './essay.model';

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

  toStats(dto: EssayStatsDto): EssayStats {
    return {
      totalCount: dto.totalCount,
      globalAverage: dto.globalAverage,
      averagesPerCompetency: { ...dto.averagesPerCompetency },
    };
  },
};
