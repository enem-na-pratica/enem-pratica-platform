import { EssayDto } from '@/src/core/application/common/dtos';
import {
  FilterBase,
  PaginatedResponse,
  PaginatedSlice,
  PaginationParams,
} from '@/src/core/application/common/queries';

export interface EssayFilter extends FilterBase {
  theme?: string;
  startDate?: Date;
  endDate?: Date;
}

export type EssayPaginatedSlice = DeepPrettify<PaginatedSlice<EssayDto>>;

export type EssaySortField = 'createdAt' | 'theme';

export type EssayPaginationParams = DeepPrettify<
  PaginationParams<EssaySortField, EssayFilter>
>;

export type EssayPaginatedResponse = DeepPrettify<PaginatedResponse<EssayDto>>;
