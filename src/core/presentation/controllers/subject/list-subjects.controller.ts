import type { SubjectDto } from '@/src/core/application/common/dtos';
import type { UseCase } from '@/src/core/application/common/interfaces';
import { handleError, ok } from '@/src/core/presentation/helpers';
import type {
  Controller,
  ErrorResponse,
  HttpResponse,
} from '@/src/core/presentation/protocols';

type ListSubjectsControllerDeps = {
  listSubjectsUseCase: UseCase<void, SubjectDto[]>;
};

export class ListSubjectsController implements Controller<void, SubjectDto[]> {
  private readonly listSubjectsUseCase: UseCase<void, SubjectDto[]>;

  constructor(deps: ListSubjectsControllerDeps) {
    this.listSubjectsUseCase = deps.listSubjectsUseCase;
  }

  async handle(): Promise<HttpResponse<SubjectDto[] | ErrorResponse>> {
    try {
      const subjects = await this.listSubjectsUseCase.execute();
      return ok(subjects);
    } catch (error) {
      return handleError(error);
    }
  }
}
