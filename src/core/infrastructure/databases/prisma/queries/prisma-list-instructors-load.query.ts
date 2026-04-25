import type { UserDto } from '@/src/core/application/common/dtos';
import type {
  InstructorWithStudentCountDto,
  ListInstructorsLoadQuery,
} from '@/src/core/application/use-cases/user/list-available-instructors';
import { ROLES } from '@/src/core/domain/auth';
import type { Mapper } from '@/src/core/domain/contracts/mappers';
import {
  type PrismaUserPublic,
  userPublicSelect,
} from '@/src/core/infrastructure/databases/prisma/selects';
import type { PrismaClient } from '@/src/generated/prisma/client';

type PrismaListInstructorsLoadQueryDeps = {
  prisma: PrismaClient;
  mapper: Mapper<PrismaUserPublic, UserDto>;
};

export class PrismaListInstructorsLoadQuery implements ListInstructorsLoadQuery {
  private readonly prisma: PrismaClient;
  private readonly mapper: Mapper<PrismaUserPublic, UserDto>;

  constructor({ prisma, mapper }: PrismaListInstructorsLoadQueryDeps) {
    this.prisma = prisma;
    this.mapper = mapper;
  }

  async execute(): Promise<InstructorWithStudentCountDto[]> {
    const instructors = await this.prisma.user.findMany({
      where: {
        role: {
          in: [ROLES.TEACHER, ROLES.ADMIN],
        },
      },
      select: {
        ...userPublicSelect,
        _count: {
          select: {
            mentorshipsAsTeacher: true,
          },
        },
      },
    });

    return instructors.map((i) => {
      return {
        instructor: this.mapper.map(i),
        studentsCount: i._count.mentorshipsAsTeacher,
      };
    });
  }
}
