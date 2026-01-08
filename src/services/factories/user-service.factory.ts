import { fetchHttpClient } from "@/src/services/factories/http-client/fetch-http-client.factory";
import { UserMapper } from "@/src/services/mappers";
import { UserService } from "@/src/services/user/user.service";

export function makeUserService() {
  const mapper = new UserMapper();
  return new UserService({
    httpClient: fetchHttpClient,
    mapper
  });
}
