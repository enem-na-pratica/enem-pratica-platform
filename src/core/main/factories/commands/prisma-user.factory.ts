import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { PrismaUserMapper } from '@/src/core/infrastructure/mapper/prisma-user.mapper';
import { PrismaUserCommand } from "@/src/core/infrastructure/commands/prisma";

export function makePrismaUserCommand() {
  const prismaUserCommand = new PrismaUserMapper();
  return new PrismaUserCommand({
    prisma,
    mapper: prismaUserCommand
  });
}