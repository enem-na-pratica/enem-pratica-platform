import { makeFetchHttpClient } from "@/src/web/api/factories/http-client";
import { UserService } from "@/src/web/api/modules/user";

export function makeUserService() {
  return new UserService({
    httpClient: makeFetchHttpClient()
  });
}
