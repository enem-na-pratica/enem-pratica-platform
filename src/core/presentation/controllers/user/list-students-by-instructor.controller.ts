import type { UserDto } from '@/src/core/application/common/dtos';
import type { UseCase } from '@/src/core/application/common/interfaces';
import { ListStudentsByInstructorInput } from '@/src/core/application/use-cases/user';
import type { Validator } from '@/src/core/domain/contracts/validation';
import { handleError, ok } from '@/src/core/presentation/helpers';
import type {
  AuthenticatedRequest,
  Controller,
  ErrorResponse,
  HttpResponse,
} from '@/src/core/presentation/protocols';

type ListStudentsByInstructorControllerDeps = {
  listStudentsByInstructorUseCase: UseCase<
    ListStudentsByInstructorInput,
    UserDto[]
  >;
  validator: Validator<string>;
};

export class ListStudentsByInstructorController implements Controller<
  void,
  UserDto[]
> {
  private readonly listStudentsByInstructorUseCase: UseCase<
    ListStudentsByInstructorInput,
    UserDto[]
  >;
  private readonly validator: Validator<string>;

  constructor({
    listStudentsByInstructorUseCase,
    validator,
  }: ListStudentsByInstructorControllerDeps) {
    this.listStudentsByInstructorUseCase = listStudentsByInstructorUseCase;
    this.validator = validator;
  }

  async handle(
    request: AuthenticatedRequest<void>,
  ): Promise<HttpResponse<UserDto[] | ErrorResponse>> {
    try {
      // '!' is safe here because this route always provides the 'username' parameter.
      const { username: rawUsername } = request.params!;

      const instructorUsername =
        rawUsername === 'me'
          ? request.requester.username
          : this.validator.validate(rawUsername);

      const listUsers = await this.listStudentsByInstructorUseCase.execute({
        instructorUsername,
        requester: request.requester,
      });

      return ok(listUsers);
    } catch (error) {
      return handleError(error);
    }
  }
}
