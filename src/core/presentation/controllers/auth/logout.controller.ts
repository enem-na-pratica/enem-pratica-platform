import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/src/core/presentation/interfaces';
import * as Http from '@/src/core/presentation/helpers/http.helper';

export class LogoutController implements Controller<void, null> {
  async handle(_request: HttpRequest<unknown>): Promise<HttpResponse<null>> {
    return Http.noContent();
  }
}