import {
  AuthenticatedRequest,
  ErrorResponse,
  HttpRequest,
  HttpResponse,
  SafeRecord,
} from './http.interfaces';

export interface Controller<
  TBody = unknown,
  TResponse = unknown,
  TParam extends SafeRecord = SafeRecord,
  TQuery extends SafeRecord = SafeRecord,
> {
  handle(
    request:
      | HttpRequest<TBody, TParam, TQuery>
      | AuthenticatedRequest<TBody, TParam, TQuery>,
  ): Promise<HttpResponse<TResponse | ErrorResponse>>;
}
