import type {
  ListUsersByRolesQuery
} from "@/src/core/application/use-cases/user/list-users-by-roles";
import type { PrismaClient } from "@/src/generated/prisma/client";
import type { Role } from "@/src/core/domain/auth";
import type { UserDto } from "@/src/core/application/common/dtos";
import {
  userPublicSelect,
  type PrismaUserPublic
} from "@/src/core/infrastructure/databases/prisma/selects";

type PrismaListUsersByRolesQueryDeps = {
  prisma: PrismaClient;
};

export class PrismaListUsersByRolesQuery implements ListUsersByRolesQuery {
  private readonly prisma: PrismaClient;

  constructor({ prisma }: PrismaListUsersByRolesQueryDeps) {
    this.prisma = prisma;
  }

  async execute(roles: Role[]): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany({
      where: {
        ...(roles.length > 0 ? { role: { in: roles } } : {})
      },
      select: userPublicSelect,
    });

    return users.map(this.mapToDto);
  }

  private mapToDto(user: PrismaUserPublic): UserDto {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}