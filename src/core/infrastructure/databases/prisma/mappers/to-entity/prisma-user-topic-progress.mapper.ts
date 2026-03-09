import type { Mapper } from '@/src/core/domain/contracts/mappers';
import { UserTopicProgress } from '@/src/core/domain/entities';
import type {
  UserTopicProgress as PrismaUserTopicProgress,
  TopicStatus,
} from '@/src/generated/prisma/client';

export class UserTopicProgressEntityMapper implements Mapper<
  PrismaUserTopicProgress,
  UserTopicProgress
> {
  map(input: PrismaUserTopicProgress): UserTopicProgress {
    return UserTopicProgress.load({
      id: input.id,
      authorId: input.authorId,
      topicId: input.topicId,
      status: input.status as TopicStatus,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    });
  }
}
