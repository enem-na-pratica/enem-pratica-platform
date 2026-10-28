import { FilterBase } from './filters/filter-base.interface';

export interface PaginationParams<
  TSortField extends string = string,
  TFilter extends FilterBase = FilterBase,
> {
  page: number;
  limit: number;
  sortBy: TSortField;
  sortOrder: 'asc' | 'desc';
  filters: TFilter;
}

export interface PaginatedSlice<T> {
  items: T[];
  totalItems: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
