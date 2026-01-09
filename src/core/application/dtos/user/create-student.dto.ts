import { CreateUserDto } from "./create-user.dto";

export type CreateStudentDto = CreateUserDto & {
  teacherId: string;
}