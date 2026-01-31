import type { UserDto } from "@/src/core/application/common/dtos";

export type InstructorWithStudentCountDto = {
  instructor: UserDto;
  studentsCount: number;
}
