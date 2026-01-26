import type {
  Controller,
  ErrorResponse,
  HttpResponse
} from '@/src/core/presentation/protocols';
import { handleError, noContent } from '@/src/core/presentation/helpers';

export class LogoutController implements Controller<void, void> {
  async handle(): Promise<HttpResponse<void | ErrorResponse>> {
    try {
      return noContent();
    } catch (error) {
      return handleError(error);
    }
  }
}