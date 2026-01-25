/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Http from './http.helper';
import { HttpResponse, ErrorResponse } from '@/src/core/presentation/protocols';

const errorMap: Record<string, (err: any) => HttpResponse<ErrorResponse>> = {
  // Auth Errors
  IncorrectPasswordError: (err) => Http.unauthorized(err),
  InvalidTokenError: (err) => Http.unauthorized(err),
  TokenExpiredError: (err) => Http.unauthorized(err),

  // Validation Errors
  ValidationError: (err) => Http.badRequest(err),
  ForbiddenError: (err) => Http.forbidden(err),

  // Resource - Not Found
  NotFoundError: (err) => Http.notFound(err),
  UserNotFoundError: (err) => Http.notFound(err),

  // Resource - Conflict
  ConflictError: (err) => Http.conflict(err),
  EntityAlreadyExistsError: (err) => Http.conflict(err),
  UserAlreadyExistsError: (err) => Http.conflict(err),
};

export const handleError = (err: any): HttpResponse<ErrorResponse> => {
  const handler = errorMap[err.constructor.name];

  if (handler) return handler(err);

  console.error(`[Unhandled Error]: ${err.constructor.name}`, err);

  return Http.serverError(err);
};