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
import type { Mapper } from "@/src/core/domain/contracts/mappers";

type PrismaListUsersByRolesQueryDeps = {
  prisma: PrismaClient;
  mapper: Mapper<PrismaUserPublic, UserDto>
};

export class PrismaListUsersByRolesQuery implements ListUsersByRolesQuery {
  private readonly prisma: PrismaClient;
  private readonly mapper: Mapper<PrismaUserPublic, UserDto>;

  constructor({ prisma, mapper }: PrismaListUsersByRolesQueryDeps) {
    this.prisma = prisma;
    this.mapper = mapper;
  }

  async execute(roles: Role[]): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany({
      where: {
        ...(roles.length > 0 ? { role: { in: roles } } : {})
      },
      select: userPublicSelect,
    });

    return users.map(this.mapper.map);
  }
}