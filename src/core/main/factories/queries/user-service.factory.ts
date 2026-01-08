import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { UserPrismaMapper } from '@/src/core/infrastructure/mapper/user-prisma.mapper';
import { UserPrismaService } from "@/src/core/infrastructure/queries/prisma/user-query.service";

export function makeUserPrismaService() {
  const userPrismaMapper = new UserPrismaMapper();
  return new UserPrismaService({
    prisma,
    mapper: userPrismaMapper
  });
}