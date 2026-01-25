export type HttpRequest<T = unknown> = {
  body: T;
  // params?: any;
  // query?: any;
  // userId?: string; // Preenchido por middlewares de auth
  // userUsername?: string; // Preenchido por middlewares de auth
  // userRole?: string; // Preenchido por middlewares de auth
}

export type HttpResponse<T = unknown> = {
  statusCode: number;
  body?: T;
  cookies?: CookieData[];
}

export type ErrorResponse<T = unknown> = {
  message: string;
  details?: T;
}

export type CookieData = {
  name: string;
  value: string;
  options: CookieOptions;
}

export type CookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  maxAge: number;
  path: string;
  sameSite: "strict" | "lax" | "none";
}
