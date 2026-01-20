import { User } from "@/src/core/domain/entities/user.entity";
import { PrismaClient, User as UserPrisma } from "@/src/generated/prisma/client";
import { StudentRegistrationCommand } from "@/src/core/application/commands/interfaces";
import { ToDomainMapper } from "@/src/core/domain/mapper";

type PrismaUserCommandDeps = {
  prisma: PrismaClient;
  mapper: ToDomainMapper<UserPrisma, User>;
}

export class PrismaUserCommand
  implements StudentRegistrationCommand {
  private readonly prisma: PrismaClient;
  private readonly mapper: ToDomainMapper<UserPrisma, User>;

  constructor(deps: PrismaUserCommandDeps) {
    this.prisma = deps.prisma;
    this.mapper = deps.mapper;
  }

  async registerStudent(
    params: { student: User; teacherId: string; }
  ): Promise<User> {
    const { student, teacherId } = params;
  
    const newStudent = await this.prisma.user.create({
      data: {
        name: student.name,
        username: student.username,
        passwordHash: student.passwordHash,
        role: student.role,
        mentorshipAsStudent: {
          create: {
            teacherId
          }
        }
      }
    });

    return this.mapper.toDomain(newStudent);
  }
}