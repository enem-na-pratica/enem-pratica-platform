import { BaseError, type ErrorCategory } from '@/src/core/domain/errors';
import type {
  ErrorResponse,
  HttpResponse,
} from '@/src/core/presentation/protocols';

import * as Http from './http.helper';

const categoryMap: Record<
  ErrorCategory,
  (err: BaseError) => HttpResponse<ErrorResponse>
> = {
  VALIDATION: Http.badRequest,
  UNAUTHORIZED: Http.unauthorized,
  FORBIDDEN: Http.forbidden,
  NOT_FOUND: Http.notFound,
  CONFLICT: Http.conflict,
  INTERNAL: Http.serverError,
};

export function handleError(error: unknown): HttpResponse<ErrorResponse> {
  if (error instanceof BaseError) {
    const handler = categoryMap[error.category];
    if (handler) return handler(error);
  }

  const genericError =
    error instanceof Error ? error : new Error(String(error));
  console.error(`[Unhandled Error]: ${genericError.name}`, genericError);

  return Http.serverError(genericError);
}
