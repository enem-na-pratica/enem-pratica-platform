import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { PrismaUserMapper } from '@/src/core/infrastructure/mapper/prisma-user.mapper';
import { PrismaUserQuery } from "@/src/core/infrastructure/queries/prisma";

export function makePrismaUserQuery() {
  const userPrismaMapper = new PrismaUserMapper();
  return new PrismaUserQuery({
    prisma,
    mapper: userPrismaMapper
  });
}