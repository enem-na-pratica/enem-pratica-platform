import type { UseCase } from '@/src/core/application/common/interfaces';
import type {
  Controller,
  ErrorResponse,
  HttpResponse
} from '@/src/core/presentation/protocols';
import { handleError, ok } from '@/src/core/presentation/helpers';
import { InstructorWithStudentCountDto } from '@/src/core/application/use-cases/user';

type ListAvailableInstructorsControllerDeps = {
  listAvailableInstructorsUseCase: UseCase<void, InstructorWithStudentCountDto[]>;
}

export class ListAvailableInstructorsController
  implements Controller<void, InstructorWithStudentCountDto[]> {
  private readonly listAvailableInstructorsUseCase: UseCase<
    void,
    InstructorWithStudentCountDto[]
  >;

  constructor({
    listAvailableInstructorsUseCase,
  }: ListAvailableInstructorsControllerDeps) {
    this.listAvailableInstructorsUseCase = listAvailableInstructorsUseCase;
  }

  async handle(): Promise<HttpResponse<InstructorWithStudentCountDto[] | ErrorResponse>> {
    try {
      const listInstructors = await this.listAvailableInstructorsUseCase.execute();

      return ok(listInstructors);
    } catch (error) {
      return handleError(error);
    }
  }
}