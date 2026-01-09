import { User } from "@/src/core/domain/user/user.entity";
import { PrismaClient } from "@/src/generated/prisma/client";
import { StudentRegistrationCommand } from "@/src/core/application/commands/interfaces";

type PrismaUserCommandDeps = {
  prisma: PrismaClient;
}

export class PrismaUserCommand
  implements StudentRegistrationCommand {
  private readonly prisma: PrismaClient;

  constructor(deps: PrismaUserCommandDeps) {
    this.prisma = deps.prisma;
  }

  async registerStudent(params: { student: User; teacherId: string; }): Promise<void> {
    const { student, teacherId } = params;
    await this.prisma.user.create({
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
  }
}