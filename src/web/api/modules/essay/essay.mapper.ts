import type {
  EssayDto,
  EssayStatsDto,
  UserEssaysOverviewDto,
} from './essay.dto';
import type { Essay, EssayStats, UserEssaysOverview } from './essay.model';

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

  toOverviewModel(dto: UserEssaysOverviewDto): UserEssaysOverview {
    return {
      statistics: EssayMapper.toStats(dto.statistics),
      essays: dto.essays.map((essayDto) => EssayMapper.toModel(essayDto)),
    };
  },
};
