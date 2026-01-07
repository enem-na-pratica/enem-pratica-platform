import { User } from "@/src/core/domain/user/user.entity";
import { PrismaClient, User as UserPrisma } from "@/src/generated/prisma/client";
import { ToDomainMapper } from "@/src/core/domain/mapper";
import { ROLES } from "@/src/core/domain/auth/roles";
import {
  GetTeachingStaffService,
  FindUsersByRolesService
} from "@/src/core/application/queries/interfaces";
import { TeachingStaffReadModel } from "@/src/core/application/queries/read-model";
import { Role } from "@/src/ui/constants";

export type UserPrismaServiceDep = {
  prisma: PrismaClient;
  mapper: ToDomainMapper<UserPrisma, User>;
}

export class UserPrismaService
  implements GetTeachingStaffService, FindUsersByRolesService {
  private readonly prisma: PrismaClient;
  private readonly mapper: ToDomainMapper<UserPrisma, User>;

  constructor(deps: UserPrismaServiceDep) {
    this.prisma = deps.prisma;
    this.mapper = deps.mapper;
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

  async getTeachingStaff(): Promise<TeachingStaffReadModel[]> {
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