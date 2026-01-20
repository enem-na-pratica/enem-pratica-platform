import { User } from "@/src/core/domain/entities/user.entity";
import { PrismaClient, User as UserPrisma } from "@/src/generated/prisma/client";
import { ToDomainMapper } from "@/src/core/domain/mapper";
import { ROLES, Role } from "@/src/core/domain/auth";
import {
  TeachingStaffQuery,
  UsersByRolesQuery,
  CheckTeacherStudentRelQuery
} from "@/src/core/application/queries/interfaces";
import { TeachingStaffReadModel } from "@/src/core/application/queries/read-model";

type PrismaUserQueryDeps = {
  prisma: PrismaClient;
  mapper: ToDomainMapper<UserPrisma, User>;
}

export class PrismaUserQuery
  implements
  TeachingStaffQuery,
  UsersByRolesQuery,
  CheckTeacherStudentRelQuery {
  private readonly prisma: PrismaClient;
  private readonly mapper: ToDomainMapper<UserPrisma, User>;

  constructor(deps: PrismaUserQueryDeps) {
    this.prisma = deps.prisma;
    this.mapper = deps.mapper;
  }

  async checkTeacherStudentRel(ids: {
    teacherId: string;
    studentId: string;
  }): Promise<boolean> {
    const { studentId, teacherId } = ids;

    const id = await this.prisma.user.findFirst({
      where: {
        id: teacherId,
        mentorshipsAsTeacher: {
          some: { studentId }
        }
      },
      select: { id: true }
    });

    return !!id
  }

  async findUsersByRoles(roles: Role[]): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        role: {
          in: roles
        }
      }
    });

    return users.map(user => this.mapper.toDomain(user));
  }

  async findTeachingStaff(): Promise<TeachingStaffReadModel[]> {
    const teachers = await this.prisma.user.findMany({
      where: {
        role: {
          in: [ROLES.TEACHER, ROLES.ADMIN],
        },
      },
      include: {
        _count: {
          select: {
            mentorshipsAsTeacher: true,
          },
        },
      },
    });

    return teachers.map((user) => ({
      user: this.mapper.toDomain(user),
      studentsCount: user._count.mentorshipsAsTeacher,
    }));
  }
}