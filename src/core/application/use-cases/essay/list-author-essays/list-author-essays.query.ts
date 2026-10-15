import type { EssayDto } from '@/src/core/application/common/dtos';
import type { Query } from '@/src/core/application/common/interfaces';

export type ListAuthorEssaysQuery = Query<string, EssayDto[]>;