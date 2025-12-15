/* eslint-disable @typescript-eslint/no-explicit-any */
export interface HttpRequest<T = any> {
  body: T;
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

export interface HttpResponse<T = any> {
  statusCode: number;
  body: T;
  cookies?: CookieData[];
}