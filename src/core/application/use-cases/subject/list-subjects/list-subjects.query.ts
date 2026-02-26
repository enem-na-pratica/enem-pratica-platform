import type { SubjectDto } from '@/src/core/application/common/dtos';
import type { Query } from '@/src/core/application/common/interfaces';

export type ListSubjectsQuery = Query<void, SubjectDto[]>;
