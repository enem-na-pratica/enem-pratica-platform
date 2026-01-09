import { UserModel, TeachingStaffModel } from "@/src/services/models";

export interface UserServiceHttp {
  getMe(): Promise<UserModel>;
  findAll(): Promise<UserModel[]>;
  findTeachingStaff(): Promise<TeachingStaffModel[]>;
}