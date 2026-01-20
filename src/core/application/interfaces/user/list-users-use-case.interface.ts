import { Role } from "@/src/core/domain/auth";
import { UserResDto } from "@/src/core/application/dtos/user";

export interface ListUsers {
  execute(role: Role): Promise<UserResDto[]>;
}