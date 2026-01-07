import { Role } from "@/src/core/domain/auth/roles";
import { UserDTO } from "@/src/core/application/dtos/user";

export interface ListUsers {
  execute(role: Role): Promise<UserDTO[]>;
}