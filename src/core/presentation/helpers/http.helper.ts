import type { HttpResponse, ErrorResponse } from '@/src/core/presentation/protocols';
import { HttpStatus } from './http-status-code.constants';
import type { BaseError } from "@/src/core/domain/errors";

export function ok<T>(data: T): HttpResponse<T> {
  return {
    statusCode: HttpStatus.OK,
    body: data,
  };
}

export function created<T>(data: T): HttpResponse<T> {
  return {
    statusCode: HttpStatus.CREATED,
    body: data,
  };
}

export function noContent(): HttpResponse<void> {
  return {
    statusCode: HttpStatus.NO_CONTENT
  };
}

export function badRequest(
  error: BaseError & { details?: unknown }
): HttpResponse<ErrorResponse> {
  return {
    statusCode: HttpStatus.BAD_REQUEST,
    body: { message: error.message, details: error.details },
  };
}

export function unauthorized(error: BaseError): HttpResponse<ErrorResponse> {
  return {
    statusCode: HttpStatus.UNAUTHORIZED,
    body: { message: error.message },
  };
}

export function forbidden(error: BaseError): HttpResponse<ErrorResponse> {
  return {
    statusCode: HttpStatus.FORBIDDEN,
    body: { message: error.message },
  };
}

export function notFound(error: BaseError): HttpResponse<ErrorResponse> {
  return {
    statusCode: HttpStatus.NOT_FOUND,
    body: { message: error.message },
  };
}

export function conflict(error: BaseError): HttpResponse<ErrorResponse> {
  return {
    statusCode: HttpStatus.CONFLICT,
    body: { message: error.message },
  };
}

export function serverError(error: Error): HttpResponse<ErrorResponse> {
  const message = error.message?.trim() || 'Erro inesperado no servidor.';
  return {
    statusCode: HttpStatus.SERVER_ERROR,
    body: { message },
  };
}