import { UserService } from "@/src/ui/application/services/infrastructure/api/get-user";
import { UserMapper } from "@/src/ui/application/services/infrastructure/mappers/user.mapper";

export function makeGetUser() {
  return new UserService({
    mapper: new UserMapper()
  });
}