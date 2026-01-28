/* eslint-disable @typescript-eslint/no-explicit-any */
export type RequestOptions = {
  data?: any;
  params?: Record<string, string | string[]>;
  query?: Record<string, string | string[]>;
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

export interface HttpClient {
  get<T>(endpoint: string, options?: Omit<RequestOptions, 'data'>): Promise<T>;
  post<T>(endpoint: string, options?: RequestOptions): Promise<T>;
  put<T>(endpoint: string, options?: RequestOptions): Promise<T>;
  patch<T>(endpoint: string, options?: RequestOptions): Promise<T>;
  delete<T>(endpoint: string, options?: Omit<RequestOptions, 'data'>): Promise<T>;
}