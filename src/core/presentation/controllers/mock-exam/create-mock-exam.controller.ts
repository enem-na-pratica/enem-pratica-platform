import type { MockExamDto } from '@/src/core/application/common/dtos';
import type { UseCase } from '@/src/core/application/common/interfaces';
import type {
  CreateMockExamDto,
  CreateMockExamInput,
} from '@/src/core/application/use-cases/mock-exam';
import type { Validator } from '@/src/core/domain/contracts';
import { created, handleError } from '@/src/core/presentation/helpers';
import type {
  AuthenticatedRequest,
  Controller,
  ErrorResponse,
  HttpResponse,
} from '@/src/core/presentation/protocols';

type CreateMockExamControllerDeps = {
  createMockExamUseCase: UseCase<CreateMockExamInput, MockExamDto>;
  validator: Validator<CreateMockExamDto>;
};

type CreateMockExamRequestBody = Prettify<
  Omit<CreateMockExamDto, 'authorUsername'>
>;
type CreateMockExamRequestParam = { username: string };

export class CreateMockExamController implements Controller<
  CreateMockExamRequestBody,
  MockExamDto,
  CreateMockExamRequestParam
> {
  private readonly createMockExamUseCase: UseCase<
    CreateMockExamInput,
    MockExamDto
  >;
  private readonly validator: Validator<CreateMockExamDto>;

  constructor({
    createMockExamUseCase,
    validator,
  }: CreateMockExamControllerDeps) {
    this.createMockExamUseCase = createMockExamUseCase;
    this.validator = validator;
  }

  async handle(
    request: AuthenticatedRequest<
      CreateMockExamRequestBody,
      CreateMockExamRequestParam
    >,
  ): Promise<HttpResponse<MockExamDto | ErrorResponse>> {
    try {
      const rawUsername = request.params?.username;
      const rawCreateMockExam = request.body;

      const rawData: CreateMockExamDto = {
        authorUsername: rawUsername,
        ...rawCreateMockExam,
      };

      const validatedData = this.validator.validate(rawData);

      const newMockExam = await this.createMockExamUseCase.execute({
        data: validatedData,
        requester: request.requester,
      });

      return created(newMockExam);
    } catch (error) {
      return handleError(error);
    }
  }
}
