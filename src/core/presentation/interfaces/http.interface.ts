export interface HttpRequest<T = unknown> {
  body: T;
}

export interface ErrorResponse<T = unknown> {
  message: string;
  details?: T;
}

export type CookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  maxAge: number;
  path: string;
  sameSite: "strict" | "lax" | "none";
}

export type CookieData = {
  name: string;
  value: string;
  options: CookieOptions;
}

export interface HttpResponse<T = unknown> {
  statusCode: number;
  body: T;
  cookies?: CookieData[];
}