import type { SubjectDto } from '@/src/core/application/common/dtos';
import type { UseCase } from '@/src/core/application/common/interfaces';

import type { ListSubjectsQuery } from './list-subjects.query';

type ListSubjectsUseCaseDeps = {
  listSubjectsQuery: ListSubjectsQuery;
};

export class ListSubjectsUseCase implements UseCase<void, SubjectDto[]> {
  private readonly listSubjectsQuery: ListSubjectsQuery;

  constructor({ listSubjectsQuery }: ListSubjectsUseCaseDeps) {
    this.listSubjectsQuery = listSubjectsQuery;
  }

  execute(): Promise<SubjectDto[]> {
    return this.listSubjectsQuery.execute();
  }
}
