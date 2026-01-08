/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, RequestOptions } from "../http-client.interface";

const HTTP_METHOD = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
} as const;

type HttpMethod = typeof HTTP_METHOD[keyof typeof HTTP_METHOD];

export class ApiError extends Error {
  constructor(public status: number, public message: string, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

export class FetchHttpClient implements HttpClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  }

  private async request<T>(
    endpoint: string,
    method: HttpMethod,
    options: RequestOptions = {},
  ): Promise<T> {
    const { data, headers, params, cache, next } = options;

    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    const url = `${this.baseUrl}${endpoint}${queryString}`;

    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      cache: cache || 'no-store',
      next: next,
    };

    if (typeof window === 'undefined') {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      config.headers = {
        ...config.headers,
        Cookie: cookieStore.toString(),
      };
    } else {
      config.credentials = 'include';
    }

    if (data) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.message || 'Ocorreu um erro na requisição',
        errorData
      );
    }

    if (response.status === 204) return {} as T;
    return response.json();
  }

  get<T>(endpoint: string, options?: Omit<RequestOptions, "data">): Promise<T> {
    return this.request<T>(endpoint, HTTP_METHOD.GET, options);
  }

  post<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, HTTP_METHOD.POST, options);
  }

  put<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, HTTP_METHOD.PUT, options);
  }

  patch<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, HTTP_METHOD.PATCH, options);
  }

  delete<T>(endpoint: string, options?: Omit<RequestOptions, "data">): Promise<T> {
    return this.request<T>(endpoint, HTTP_METHOD.DELETE, options);
  }
}