import type { MockExamDto } from '@/src/core/application/common/dtos';
import type { Query } from '@/src/core/application/common/interfaces';

export type ListMockExamsByAuthorQuery = Query<string, MockExamDto[]>;
