import type { Query } from '@/src/core/application/common/interfaces';

import {
  EssayPaginatedSlice,
  EssayPaginationParams,
} from './list-essays.contracts';

export type ListEssaysQuery = Query<EssayPaginationParams, EssayPaginatedSlice>;
