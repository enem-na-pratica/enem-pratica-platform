import { UserRepository } from "@/src/core/domain/user/user.repository.interface";
import { User } from "@/src/core/domain/user/user.entity";
import { PrismaClient, User as UserPrisma } from "@/src/generated/prisma/client";
import { ToDomainMapper } from "@/src/core/domain/mapper";

export type UserPrismaRepositoryDep = {
  prisma: PrismaClient;
  mapper: ToDomainMapper<UserPrisma, User>;
}

export class UserPrismaRepository implements UserRepository {
  private readonly prisma: PrismaClient;
  private readonly mapper: ToDomainMapper<UserPrisma, User>;

  constructor(deps: UserPrismaRepositoryDep) {
    this.prisma = deps.prisma;
    this.mapper = deps.mapper;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map(user => this.mapper.toDomain(user));
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { username } });

    if (!user) return null;

    return this.mapper.toDomain(user);
  }
}