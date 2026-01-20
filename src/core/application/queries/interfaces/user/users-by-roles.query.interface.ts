import { User } from "@/src/core/domain/entities/user.entity";
import { Role } from "@/src/ui/constants";

export interface UsersByRolesQuery {
  findUsersByRoles(roles: Role[]): Promise<User[]>;
}