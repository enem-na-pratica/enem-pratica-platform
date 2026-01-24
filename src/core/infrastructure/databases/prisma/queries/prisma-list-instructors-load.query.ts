import type {
  ListInstructorsLoadQuery,
  InstructorWithStudentCountDto
} from "@/src/core/application/use-cases/user/list-available-instructors";
import type { PrismaClient } from "@/src/generated/prisma/client";
import { ROLES } from "@/src/core/domain/auth";
import {
  userPublicSelect,
  type PrismaUserPublic
} from "@/src/core/infrastructure/databases/prisma/selects";

type PrismaListInstructorsLoadQueryDeps = {
  prisma: PrismaClient;
};

export class PrismaListInstructorsLoadQuery implements ListInstructorsLoadQuery {
  private readonly prisma: PrismaClient;

  constructor({ prisma }: PrismaListInstructorsLoadQueryDeps) {
    this.prisma = prisma;
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

    return instructors.map(this.mapToDto);
  }

  private mapToDto(
    user: PrismaUserPublic & { _count: { mentorshipsAsTeacher: number } }
  ): InstructorWithStudentCountDto {
    return {
      instructor: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      studentsCount: user._count.mentorshipsAsTeacher,
    };
  }
}