import { HttpClient, RequestOptions } from "@/src/web/api/shared";
import { ApiError } from "@/src/web/api/http/api-error";

const HTTP_METHOD = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
} as const;

type HttpMethod = typeof HTTP_METHOD[keyof typeof HTTP_METHOD];

export class FetchHttpClient implements HttpClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  }

  private applyPathParams(
    endpoint: string,
    params?: Record<string, string | string[]>
  ): string {
    if (!params) return endpoint;
    let result = endpoint;
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;
      const replacement = Array.isArray(value)
        ? value.map(v => encodeURIComponent(String(v))).join('/')
        : encodeURIComponent(String(value));

      const colonPattern = new RegExp(`:${key}\\b`, 'g');
      result = result.replace(colonPattern, replacement);

      const bracePattern = new RegExp(`\\{${key}\\}`, 'g');
      result = result.replace(bracePattern, replacement);
    }
    return result;
  }

  private buildQueryString(query?: Record<string, string | string[]>): string {
    if (!query) return '';
    const usp = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) {
        for (const item of value) usp.append(key, String(item));
      } else {
        usp.append(key, String(value));
      }
    }
    const s = usp.toString();
    return s ? `?${s}` : '';
  }

  private async request<T>(
    endpoint: string,
    method: HttpMethod,
    options: RequestOptions = {},
  ): Promise<T> {
    const { data, headers, params, query, cache, next } = options;

    const endpointWithParams = this.applyPathParams(endpoint, params);

    const base = this.baseUrl.replace(/\/+$/, '');
    const path = String(endpointWithParams).replace(/^\/+/, '');

    const queryString = this.buildQueryString(query);

    const url = `${base}/${path}${queryString}`;

    const defaultHeaders: Record<string, string> = {
      Accept: 'application/json',
      ...(headers || {}),
    };

    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;

    if (!isFormData && data !== undefined) {
      defaultHeaders['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      method,
      headers: defaultHeaders,
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

    if (data !== undefined) {
      if (isFormData) {
        config.body = data;
      } else {
        config.body = JSON.stringify(data);
      }
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError({
        message: errorData.message || 'Ocorreu um erro na requisição',
        status: response.status,
        data: errorData
      });
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