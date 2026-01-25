import type { Role } from '@/src/core/domain/auth';

type Requester = {
  id: string;
  username: string;
  role: Role;
};

export type HttpRequest<T = unknown> = {
  body: T;
  // params?: any;
  // query?: any;
}

export type AuthenticatedRequest<T = unknown> = HttpRequest<T> & {
  requester: Requester;
};



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
