import { AuthServiceHttp } from '@/src/services/auth/auth.service.interface';
import { HttpClient } from '@/src/services/common/http/http-client.interface';
import { UserResponseDto } from '@/src/services/dtos';

type AuthServiceDeps = {
  httpClient: HttpClient,
}

export class AuthService implements AuthServiceHttp {
  private readonly httpClient: HttpClient;

  constructor(deps: AuthServiceDeps) {
    this.httpClient = deps.httpClient;
  }

  async login(params: { username: string, password: string }): Promise<void> {
    await this.httpClient.post<UserResponseDto>(
      "/auth/login",
      { data: params }
    );
  }

  async logout(): Promise<void> {
    await this.httpClient.delete<UserResponseDto>("/auth/logout");
  }
}
