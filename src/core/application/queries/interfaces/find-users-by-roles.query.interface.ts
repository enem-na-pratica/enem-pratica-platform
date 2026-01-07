import { User } from "@/src/core/domain/user/user.entity";
import { Role } from "@/src/ui/constants";

export interface FindUsersByRolesService {
  findUsersByRoles(roles: Role[]): Promise<User[]>;
}