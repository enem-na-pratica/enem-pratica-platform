import { UserModel, TeachingStaffModel } from "@/src/services/api/models";

export interface UserServiceHttp {
  getMe(): Promise<UserModel>;
  create(dataUser: unknown): Promise<UserModel>;
  findAll(): Promise<UserModel[]>;
  findTeachingStaff(): Promise<TeachingStaffModel[]>;
}