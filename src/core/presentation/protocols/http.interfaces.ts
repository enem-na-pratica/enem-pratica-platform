import type { Role } from '@/src/core/domain/auth';

type Requester = {
  id: string;
  username: string;
  role: Role;
};

export type SafeRecord = Record<string, string | string[]>;

export type HttpRequest<
  Body = unknown,
  Param extends SafeRecord = SafeRecord,
  Query extends SafeRecord = SafeRecord,
> = {
  body: Body;
  params?: Param;
  query?: Query;
};

export type AuthenticatedRequest<
  Body = unknown,
  Param extends SafeRecord = SafeRecord,
  Query extends SafeRecord = SafeRecord,
> = HttpRequest<Body, Param, Query> & {
  requester: Requester;
};

export type HttpResponse<T = unknown> = {
  statusCode: number;
  body?: T;
  cookies?: CookieData[];
};

export type ErrorResponse<T = unknown> = {
  message: string;
  details?: T;
};

export type CookieData = {
  name: string;
  value: string;
  options: CookieOptions;
};

export type CookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  maxAge: number;
  path: string;
  sameSite: 'strict' | 'lax' | 'none';
};
