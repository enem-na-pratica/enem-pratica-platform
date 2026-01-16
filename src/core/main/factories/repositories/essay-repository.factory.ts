import { PrismaEssayRepository } from "@/src/core/infrastructure/repositories/prisma/essay.repository";
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { PrismaEssayMapper } from '@/src/core/infrastructure/mapper/prisma-essay.mapper';

export function makePrismaEssayRepository() {
  const prismaEssayMapper = new PrismaEssayMapper();
  return new PrismaEssayRepository({
    prisma,
    mapper: prismaEssayMapper,
  });
}