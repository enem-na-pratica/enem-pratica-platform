import { User } from "@/src/core/domain/entities";
import { Mapper } from "@/src/core/domain/contracts/mappers";
import { User as PrismaUser } from "@/src/generated/prisma/client";

export class UserEntityMapper implements Mapper<PrismaUser, User> {
  map(prismaUser: PrismaUser): User {
    return User.load({
      id: prismaUser.id,
      name: prismaUser.name,
      username: prismaUser.username,
      passwordHash: prismaUser.passwordHash,
      role: prismaUser.role,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }
}
