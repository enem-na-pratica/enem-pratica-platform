import type {
  UserRepository,
  CreateUserParams
} from '@/src/core/domain/contracts/repositories';
import type { User } from '@/src/core/domain/entities';
import type { PrismaClient, User as PrismaUser } from "@/src/generated/prisma/client";
import type { Mapper } from "@/src/core/domain/contracts/mappers";

type PrismaUserRepositoryDeps = {
  prisma: PrismaClient;
  mapper: Mapper<PrismaUser, User>;
};

export class PrismaUserRepository implements UserRepository {
  private readonly prisma: PrismaClient;
  private readonly mapper: Mapper<PrismaUser, User>;

  constructor({ prisma, mapper }: PrismaUserRepositoryDeps) {
    this.prisma = prisma;
    this.mapper = mapper;
  }

  async create({ user, teacherId }: CreateUserParams): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: {
        name: user.name,
        username: user.username,
        passwordHash: user.passwordHash,
        role: user.role,
        ...(teacherId && {
          mentorshipAsStudent: {
            create: {
              teacherId
            }
          }
        })
      }
    });

    return this.mapper.map(newUser);
  }

  async getById(userId: string): Promise<User> {
    throw new Error('Method not implemented.');
  }

  async findByUsername(username: string): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
}