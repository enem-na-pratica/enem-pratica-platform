import { HttpClient } from '@/src/web/api/shared';

type AuthServiceDeps = {
  httpClient: HttpClient,
}

export class AuthService {
  private readonly httpClient: HttpClient;

  constructor(deps: AuthServiceDeps) {
    this.httpClient = deps.httpClient;
  }

  login(params: { username: string, password: string }) {
    return this.httpClient.post<void>({
      endpoint: "/auth/login",
      options: { data: params }
    });
  }

  logout(): Promise<void> {
    return this.httpClient.delete<void>({ endpoint: "/auth/logout" });
  }
}
