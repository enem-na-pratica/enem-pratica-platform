import { UserPrismaRepository } from "@/src/core/infrastructure/repositories/prisma/user-prisma.repository";
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { UserPrismaMapper } from '@/src/core/infrastructure/mapper/user-prisma.mapper';
import { UserRepository } from "@/src/core/domain/user/user.repository.interface";

export function makeUserPrismaRepository(): UserRepository {
  const userPrismaMapper = new UserPrismaMapper();
  return new UserPrismaRepository({
    prisma,
    mapper: userPrismaMapper
  });
}
