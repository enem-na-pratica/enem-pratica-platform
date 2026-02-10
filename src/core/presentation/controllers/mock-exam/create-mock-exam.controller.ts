import type { MockExamDto } from '@/src/core/application/common/dtos';
import type { UseCase } from '@/src/core/application/common/interfaces';
import type {
  CreateMockExamDto,
  CreateMockExamInput
} from '@/src/core/application/use-cases/mock-exam';
import type { Validator } from '@/src/core/domain/contracts';
import type {
  Controller,
  ErrorResponse,
  HttpResponse,
  AuthenticatedRequest
} from '@/src/core/presentation/protocols';
import { handleError, created } from '@/src/core/presentation/helpers';

type CreateMockExamControllerDeps = {
  createMockExamUseCase: UseCase<CreateMockExamInput, MockExamDto>;
  validator: Validator<CreateMockExamDto>;
};

export class CreateMockExamController implements Controller<
  CreateMockExamDto,
  MockExamDto
> {
  private readonly createMockExamUseCase: UseCase<CreateMockExamInput, MockExamDto>;
  private readonly validator: Validator<CreateMockExamDto>;

  constructor({ createMockExamUseCase, validator }: CreateMockExamControllerDeps) {
    this.createMockExamUseCase = createMockExamUseCase;
    this.validator = validator;
  }

  async handle(request: AuthenticatedRequest<CreateMockExamDto>): Promise<HttpResponse<MockExamDto | ErrorResponse>> {
    try {
      const validatedData = this.validator.validate(request.body);

      const newMockExam = await this.createMockExamUseCase.execute({
        data: validatedData,
        requester: request.requester
      });

      return created(newMockExam);
    } catch (error) {
      return handleError(error);
    }
  }
}