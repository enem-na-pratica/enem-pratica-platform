import { UserAccessService } from "@/src/core/domain/services";
import {
  makePrismaUserRepository,
  makePrismaStudentTeacherRepository
} from "@/src/core/main/factories/common/repositories";

export function makeUserAccessService() {
  return new UserAccessService({
    userRepository: makePrismaUserRepository(),
    studentTeacherRepository: makePrismaStudentTeacherRepository(),
  });
}