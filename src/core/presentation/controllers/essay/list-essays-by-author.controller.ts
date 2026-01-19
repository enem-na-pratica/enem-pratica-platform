import {
  Controller,
  ErrorResponse,
  HttpRequest,
  HttpResponse
} from '@/src/core/presentation/interfaces';
import * as Http from '@/src/core/presentation/helpers/http.helper';
import { handleError } from '@/src/core/presentation/helpers/error-handler.helper';
import { FindAllByAuthor } from '@/src/core/application/interfaces/essay/find-all-by-author-use-case.interface';
import { EssaysResponse } from "@/src/core/application/dtos/essay";

export type FindEssaysByAuthorControllerDeps = {
  findAllByAuthorUseCase: FindAllByAuthor;
}

export class FindEssaysByAuthorController
  implements Controller<{ authorId: string }, EssaysResponse> {
  private readonly findAllByAuthorUseCase: FindAllByAuthor;

  constructor(deps: FindEssaysByAuthorControllerDeps) {
    this.findAllByAuthorUseCase = deps.findAllByAuthorUseCase;
  }

  async handle(
    request: HttpRequest<{ authorId: string }>
  ): Promise<HttpResponse<EssaysResponse | ErrorResponse>> {
    try {
      const { authorId } = request.body;

      const essays = await this.findAllByAuthorUseCase.execute(authorId);

      return Http.ok(essays);
    } catch (error) {
      return handleError(error);
    }
  }

}