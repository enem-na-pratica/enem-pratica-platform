import {
  ListStudentsByInstructorController
} from "@/src/core/presentation/controllers/user";
import {
  ZodValidator,
  usernameSchema
} from "@/src/core/infrastructure/validation/zod";
import {
  ListStudentsByInstructorUseCase
} from "@/src/core/application/use-cases/user";
import {
  makePrismaUserRepository
} from "@/src/core/main/factories/common/repositories";
import {
  PrismaListStudentsByInstructorQuery
} from "@/src/core/infrastructure/databases/prisma/queries";
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { makePrismaUserDtoMapper } from '@/src/core/main/factories/common/mappers';

export function makeListInstructorStudents() {
  const prismaListStudentsByInstructorQuery = new PrismaListStudentsByInstructorQuery({
    mapper: makePrismaUserDtoMapper(),
    prisma,
  });

  const listStudentsByInstructorUseCase = new ListStudentsByInstructorUseCase({
    listStudentsByInstructor: prismaListStudentsByInstructorQuery,
    userRepository: makePrismaUserRepository(),
  });

  const zodValidator = new ZodValidator(usernameSchema);

  return new ListStudentsByInstructorController({
    listStudentsByInstructorUseCase,
    validator: zodValidator,
  });
}