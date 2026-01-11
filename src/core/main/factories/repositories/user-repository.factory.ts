import { UserPrismaRepository } from "@/src/core/infrastructure/repositories/prisma/user-prisma.repository";
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { PrismaUserMapper } from '@/src/core/infrastructure/mapper/prisma-user.mapper';
import { UserRepository } from "@/src/core/domain/user/user.repository.interface";

export function makeUserPrismaRepository(): UserRepository {
  const userPrismaMapper = new PrismaUserMapper();
  return new UserPrismaRepository({
    prisma,
    mapper: userPrismaMapper
  });
}
