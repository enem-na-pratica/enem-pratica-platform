import { UserDTO } from "./user.dto";

export type LoginOutputDTO = {
  accessToken: string;
  user: UserDTO
};