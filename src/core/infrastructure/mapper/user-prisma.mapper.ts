import { User } from "@/src/core/domain/user/user.entity";
import { ToDomainMapper } from "@/src/core/domain/mapper";
import { User as UserPrisma } from "@/src/generated/prisma/client";

export class UserPrismaMapper
  implements ToDomainMapper<UserPrisma, User> {
  toDomain(input: UserPrisma): User {
    return User.load({
      id: input.id,
      name: input.name,
      username: input.username,
      passwordHash: input.passwordHash,
      role: input.role,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    });
  }
}
