import { fetchHttpClient } from "@/src/services/factories/http-client/fetch-http-client.factory";
import { AuthService } from "@/src/services/auth/auth.service";

export function makeAuthService() {
  return new AuthService({
    httpClient: fetchHttpClient
  });
}
