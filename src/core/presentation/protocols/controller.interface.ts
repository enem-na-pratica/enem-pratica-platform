import { ErrorResponse, HttpRequest, HttpResponse } from './http.interfaces';

export interface Controller<TReq, TRes> {
  handle(
    request: HttpRequest<TReq>
  ): Promise<HttpResponse<TRes | ErrorResponse>>;
}
