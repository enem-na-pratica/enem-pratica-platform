import { UserRepository } from "@/src/core/domain/user/user.repository.interface";
import { User } from "@/src/core/domain/user/user.entity";
import { PrismaClient } from "@/src/generated/prisma/client";

export class UserPrismaRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) { }
  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { username } });

    if (!user) return null;

    // Implementar um mapper
    return User.load(user);
  }
}