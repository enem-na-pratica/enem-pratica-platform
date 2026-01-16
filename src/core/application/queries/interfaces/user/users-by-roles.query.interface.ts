import { User } from "@/src/core/domain/user/user.entity";
import { Role } from "@/src/ui/constants";

export interface UsersByRolesQuery {
  findUsersByRoles(roles: Role[]): Promise<User[]>;
}