import { UserModel } from "@/src/services/models";

export interface UserServiceHttp {
  getMe(): Promise<UserModel>;
  findAll(): Promise<UserModel[]>;
}