import { User } from "@/src/core/domain/entities/user.entity";

export interface StudentRegistrationCommand {
  registerStudent(params: {student: User, teacherId: string}): Promise<User>;
}