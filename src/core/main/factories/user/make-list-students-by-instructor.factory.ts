import { ListStudentsByInstructorUseCase } from '@/src/core/application/use-cases/user';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { PrismaListStudentsByInstructorQuery } from '@/src/core/infrastructure/databases/prisma/queries';
import {
  ZodValidator,
  usernameSchema,
} from '@/src/core/infrastructure/validation/zod';
import { makePrismaUserDtoMapper } from '@/src/core/main/factories/common/mappers';
import { makeUserAccessService } from '@/src/core/main/factories/common/services';
import { ListStudentsByInstructorController } from '@/src/core/presentation/controllers/user';

export function makeListStudentsByInstructor() {
  const prismaListStudentsByInstructorQuery =
    new PrismaListStudentsByInstructorQuery({
      mapper: makePrismaUserDtoMapper(),
      prisma,
    });

  const listStudentsByInstructorUseCase = new ListStudentsByInstructorUseCase({
    listStudentsByInstructor: prismaListStudentsByInstructorQuery,
    userAccessService: makeUserAccessService(),
  });

  const zodValidator = new ZodValidator(usernameSchema);

  return new ListStudentsByInstructorController({
    listStudentsByInstructorUseCase,
    validator: zodValidator,
  });
}
