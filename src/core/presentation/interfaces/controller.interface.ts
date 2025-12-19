import { ErrorResponse, HttpRequest, HttpResponse } from './http.interface';

export interface Controller<TReq = unknown, TRes = unknown> {
  handle(
    request: HttpRequest<TReq>
  ): Promise<HttpResponse<TRes | ErrorResponse>>;
}
