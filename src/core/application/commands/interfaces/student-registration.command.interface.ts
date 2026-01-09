import { CreateStudentDto } from "@/src/core/application/dtos/user";

export interface StudentRegistrationCommand {
  registerStudent(input: CreateStudentDto): Promise<void>;
}