import { UserDTO } from "@/src/core/application/dtos/user";

export type LoginOutputDTO = {
  accessToken: string;
  user: UserDTO
};