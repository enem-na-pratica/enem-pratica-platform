export type RequestOptions = {
  data?: unknown;
  params?: Record<string, string | string[]>;
  query?: Record<string, string | string[]>;
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

export interface HttpClient {
  get<T>(args: { endpoint: string, options?: Omit<RequestOptions, 'data'> }): Promise<T>;
  post<T>(args: { endpoint: string, options?: RequestOptions }): Promise<T>;
  put<T>(args: { endpoint: string, options?: RequestOptions }): Promise<T>;
  patch<T>(args: { endpoint: string, options?: RequestOptions }): Promise<T>;
  delete<T>(
    args: { endpoint: string, options?: Omit<RequestOptions, 'data'> }
  ): Promise<T>;
}