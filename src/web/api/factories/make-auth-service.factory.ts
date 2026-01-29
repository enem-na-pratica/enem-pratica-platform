import { makeFetchHttpClient } from "@/src/web/api/factories/http-client";
import { AuthService } from "@/src/web/api/modules/auth";

export function makeAuthService() {
  return new AuthService({
    httpClient: makeFetchHttpClient()
  });
}
