export type UserDto = {
  id: string;
  name: string;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export type InstructorWithStudentCountDto = {
  instructor: UserDto;
  studentsCount: number;
}