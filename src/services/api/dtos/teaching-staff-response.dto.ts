import { UserResponseDto } from "./user-response.dto"

export type TeachingStaffDto = {
  user: UserResponseDto,
  studentsCount: number;
}