import { UserDTO } from "@/src/core/application/dtos/user";

export interface GetCurrentUser {
  execute(username: string): Promise<UserDTO>;
}