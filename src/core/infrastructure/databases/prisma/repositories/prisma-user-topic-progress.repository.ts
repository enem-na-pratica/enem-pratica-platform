import type { Mapper } from '@/src/core/domain/contracts/mappers';
import type { UserTopicProgressRepository } from '@/src/core/domain/contracts/repositories';
import type { UserTopicProgress } from '@/src/core/domain/entities';
import { NotFoundError, UserNotFoundError } from '@/src/core/domain/errors';
import {
  Prisma,
  type PrismaClient,
  type UserTopicProgress as PrismaUserTopicProgress,
} from '@/src/generated/prisma/client';

type PrismaUserTopicProgressRepositoryDeps = {
  prisma: PrismaClient;
  mapper: Mapper<PrismaUserTopicProgress, UserTopicProgress>;
};

export class PrismaUserTopicProgressRepository implements UserTopicProgressRepository {
  private readonly prisma: PrismaClient;
  private readonly mapper: Mapper<PrismaUserTopicProgress, UserTopicProgress>;

  constructor({ prisma, mapper }: PrismaUserTopicProgressRepositoryDeps) {
    this.prisma = prisma;
    this.mapper = mapper;
  }

  async setProgress(
    userTopicProgress: UserTopicProgress,
  ): Promise<UserTopicProgress> {
    try {
      const persistedProgress = await this.prisma.userTopicProgress.upsert({
        where: {
          userId_topicId: {
            userId: userTopicProgress.userId,
            topicId: userTopicProgress.topicId,
          },
        },
        update: { status: userTopicProgress.status },
        create: {
          userId: userTopicProgress.userId,
          topicId: userTopicProgress.topicId,
          status: userTopicProgress.status,
        },
      });

      return this.mapper.map(persistedProgress);
    } catch (error) {
      this.handlePrismaError({ error, data: userTopicProgress });
      throw error;
    }
  }

  private handlePrismaError({
    error,
    data,
  }: {
    error: unknown;
    data: UserTopicProgress;
  }): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      const target = (error.meta?.field_name as string) ?? '';

      if (target.includes('topicId')) {
        // TODO: Consider introducing a dedicated TopicNotFoundError
        // if Topic requires domain-specific behavior or handling in the future.
        throw new NotFoundError({
          entityName: 'Topic',
          fieldName: 'id',
          entityValue: data.topicId,
        });
      }

      if (target.includes('userId')) {
        throw new UserNotFoundError({
          fieldName: 'userId',
          entityValue: data.userId,
        });
      }
    }
  }
}
