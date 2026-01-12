import { User } from "@/src/core/domain/user/user.entity";

export interface StudentRegistrationCommand {
  registerStudent(params: {student: User, teacherId: string}): Promise<User>;
}