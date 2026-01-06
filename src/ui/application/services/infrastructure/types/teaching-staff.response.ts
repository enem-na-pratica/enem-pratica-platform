import { UserResponse } from "./user.response"

export type TeachingStaffResponse = {
  user: UserResponse,
  studentsCount: number;
}