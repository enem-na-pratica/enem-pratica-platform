import {
  Controller,
  HttpRequest,
  HttpResponse,
  ErrorResponse
} from '@/src/core/presentation/interfaces';
import * as Http from '@/src/core/presentation/helpers/http.helper';
import { handleError } from '@/src/core/presentation/helpers/error-handler.helper';
import { CreateEssayDto, EssayContent, EssayResDto } from '@/src/core/application/dtos/essay';
import { CreateEssay } from "@/src/core/application/interfaces/essay/create-essay-use-case.interface";
import { Validation } from '@/src/core/domain/contracts/validation/validation.interface';

export type CreateEssayControllerDeps = {
  createEssayUseCase: CreateEssay;
  createEssayValidator: Validation<EssayContent>;
}

export class CreateEssayController
  implements Controller<CreateEssayDto, EssayResDto> {
  private readonly createEssayUseCase: CreateEssay;
  private readonly createEssayValidator: Validation<EssayContent>;

  constructor(deps: CreateEssayControllerDeps) {
    this.createEssayUseCase = deps.createEssayUseCase;
    this.createEssayValidator = deps.createEssayValidator;
  }

  async handle(
    request: HttpRequest<CreateEssayDto>
  ): Promise<HttpResponse<EssayResDto | ErrorResponse<unknown>>> {
    try {
      const validatedEssay = this.createEssayValidator.validate(request.body.essayData);

      const newEssay = await this.createEssayUseCase.execute({
        ...request.body,
        essayData: validatedEssay
      });

      return Http.created(newEssay);
    } catch (error) {
      return handleError(error);
    }

  }
}