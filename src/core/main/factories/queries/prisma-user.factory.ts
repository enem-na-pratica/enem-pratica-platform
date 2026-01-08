import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { UserPrismaMapper } from '@/src/core/infrastructure/mapper/user-prisma.mapper';
import { PrismaUserQuery } from "@/src/core/infrastructure/queries/prisma";

export function makePrismaUserQuery() {
  const userPrismaMapper = new UserPrismaMapper();
  return new PrismaUserQuery({
    prisma,
    mapper: userPrismaMapper
  });
}