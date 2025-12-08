/* eslint-disable @typescript-eslint/no-explicit-any */
export interface HttpRequest<T = any> {
  body: T;
}

export interface HttpResponse<T = any> {
  statusCode: number;
  body: T;
  cookies?: Array<{
    name: string;
    value: string;
    options: any;
  }>;
}