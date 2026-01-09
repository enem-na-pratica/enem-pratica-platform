import { fetchHttpClient } from "@/src/services/api/factories/http-client/fetch-http-client.factory";
import { UserMapper } from "@/src/services/api/mappers";
import { UserService } from "@/src/services/api/modules/user/user.service";

export function makeUserService() {
  const mapper = new UserMapper();
  return new UserService({
    httpClient: fetchHttpClient,
    mapper
  });
}
