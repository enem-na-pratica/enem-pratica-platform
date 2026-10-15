import type { Query } from '@/src/core/application/common/interfaces';

import type { EssayStatsDto } from './essay-stats.dto';

export type EssayStatsWithoutGlobal = Omit<EssayStatsDto, 'globalAverage'>;

export type GetAuthorEssaysStatsQuery = Query<string, EssayStatsWithoutGlobal>;
