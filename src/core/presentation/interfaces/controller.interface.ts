import { HttpRequest, HttpResponse } from './http.interface';

export interface Controller {
  handle(request: HttpRequest): Promise<HttpResponse>;
}
