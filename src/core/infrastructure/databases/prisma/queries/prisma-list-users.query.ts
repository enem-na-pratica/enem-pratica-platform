import type { UserDto } from '@/src/core/application/common/dtos';
import type { ListUsersQuery } from '@/src/core/application/use-cases/user/list-users';
import type { Role } from '@/src/core/domain/auth';
import type { Mapper } from '@/src/core/domain/contracts/mappers';
import {
  type PrismaUserPublic,
  userPublicSelect,
} from '@/src/core/infrastructure/databases/prisma/selects';
import type { PrismaClient } from '@/src/generated/prisma/client';

type PrismaListUsersQueryDeps = {
  prisma: PrismaClient;
  mapper: Mapper<PrismaUserPublic, UserDto>;
};

export class PrismaListUsersQuery implements ListUsersQuery {
  private readonly prisma: PrismaClient;
  private readonly mapper: Mapper<PrismaUserPublic, UserDto>;

  constructor({ prisma, mapper }: PrismaListUsersQueryDeps) {
    this.prisma = prisma;
    this.mapper = mapper;
  }

  async execute(roles: Role[]): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany({
      where: {
        ...(roles.length > 0 ? { role: { in: roles } } : {}),
      },
      select: userPublicSelect,
    });

    return users.map(this.mapper.map);
  }
}
