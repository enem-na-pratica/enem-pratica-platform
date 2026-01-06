import { User } from "@/src/core/domain/user/user.entity";
import { PrismaClient, User as UserPrisma } from "@/src/generated/prisma/client";
import { ToDomainMapper } from "@/src/core/domain/mapper";
import { ROLES } from "@/src/core/domain/auth/roles";
import { GetTeachingStaffService } from "@/src/core/application/queries/interfaces/get-teaching-staff.query.interface";
import { TeachingStaffReadModel } from "@/src/core/application/queries/read-model";

export type UserPrismaServiceDep = {
  prisma: PrismaClient;
  mapper: ToDomainMapper<UserPrisma, User>;
}

export class UserPrismaService implements GetTeachingStaffService {
  private readonly prisma: PrismaClient;
  private readonly mapper: ToDomainMapper<UserPrisma, User>;

  constructor(deps: UserPrismaServiceDep) {
    this.prisma = deps.prisma;
    this.mapper = deps.mapper;
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