import { fetchHttpClient } from "@/src/services/api/factories/http-client/fetch-http-client.factory";
import { AuthService } from "@/src/services/api/modules/auth/auth.service";

export function makeAuthService() {
  return new AuthService({
    httpClient: fetchHttpClient
  });
}
