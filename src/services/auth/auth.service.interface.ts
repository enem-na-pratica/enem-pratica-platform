export interface AuthServiceHttp {
  login(params: { username: string, password: string }): Promise<void>;
}