import { UserModel } from "@/src/services/models";

export interface UserServiceHttp {
  login(params: { username: string, password: string }): Promise<void>;
  getMe(): Promise<UserModel>;
}