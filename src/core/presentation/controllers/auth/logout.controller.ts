import { Controller, HttpRequest, HttpResponse } from '@/src/core/presentation/interfaces';

export class LogoutController implements Controller {
  async handle(request: HttpRequest): Promise<HttpResponse> {
    return {
      statusCode: 204,
      body: null,
    } as HttpResponse<null>;
  }
}