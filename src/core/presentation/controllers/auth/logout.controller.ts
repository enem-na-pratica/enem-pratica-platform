import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/src/core/presentation/interfaces';

export class LogoutController implements Controller<void, null> {
  async handle(_request: HttpRequest<unknown>): Promise<HttpResponse<null>> {
    return {
      statusCode: 204,
      body: null,
    };
  }
}