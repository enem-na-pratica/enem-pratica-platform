import { UserModel } from "./user.model"

export type TeachingStaffModel = {
  user: UserModel,
  studentsCount: number;
}