import { UserService } from "@/src/ui/application/services/infrastructure/api/user-servive";
import { UserMapper } from "@/src/ui/application/services/infrastructure/mappers/user.mapper";

export function makeUserService() {
  return new UserService({
    mapper: new UserMapper()
  });
}