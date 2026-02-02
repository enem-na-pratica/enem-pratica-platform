import {
  ListStudentsByInstructorQuery
} from '@/src/core/application/use-cases/user';
import type { Mapper } from "@/src/core/domain/contracts/mappers";
import type { UserDto } from '@/src/core/application/common/dtos';
import type { PrismaClient } from "@/src/generated/prisma/client";
import {
  userPublicSelect,
  type PrismaUserPublic
} from "@/src/core/infrastructure/databases/prisma/selects";
import { UserNotFoundError } from '@/src/core/domain/errors';

type PrismaListStudentsByInstructorQueryDeps = {
  prisma: PrismaClient;
  mapper: Mapper<PrismaUserPublic, UserDto>;
};

export class PrismaListStudentsByInstructorQuery
  implements ListStudentsByInstructorQuery {
  private readonly prisma: PrismaClient;
  private readonly mapper: Mapper<PrismaUserPublic, UserDto>;

  constructor({ prisma, mapper }: PrismaListStudentsByInstructorQueryDeps) {
    this.prisma = prisma;
    this.mapper = mapper;
  }

  async execute(instructorId: string): Promise<UserDto[]> {
    const students = await this.prisma.user.findUnique({
      where: {
        id: instructorId,
      },
      select: {
        mentorshipsAsTeacher: {
          select: {
            student: {
              select: userPublicSelect,
            }
          },
        },
      },
    });

    if (!students) {
      throw new UserNotFoundError({
        fieldName: 'username (Instructor)',
        entityValue: instructorId
      });
    }

    return students.mentorshipsAsTeacher.map(s => this.mapper.map(s.student));
  }
}