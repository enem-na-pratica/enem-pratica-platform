import type { TopicProgressDto } from '@/src/core/application/use-cases/subject';
import type { Mapper } from '@/src/core/domain/contracts/mappers';
import type { PrismaTopicWithProgress } from '@/src/core/infrastructure/databases/prisma/types';

export class PrismaTopicProgressDtoMapper implements Mapper<
  PrismaTopicWithProgress,
  TopicProgressDto
> {
  public map(prismaTopic: PrismaTopicWithProgress): TopicProgressDto {
    const userProgress = prismaTopic.userTopicProgresses?.[0] || null;

    return {
      topic: {
        id: prismaTopic.id,
        title: prismaTopic.title,
        position: prismaTopic.position,
        subjectId: prismaTopic.subjectId,
        createdAt: prismaTopic.createdAt,
      },
      progress: userProgress
        ? {
            id: userProgress.id,
            authorId: userProgress.authorId,
            topicId: userProgress.topicId,
            status: userProgress.status,
            updatedAt: userProgress.updatedAt.toISOString(),
            createdAt: userProgress.createdAt.toISOString(),
          }
        : null,
    };
  }
}
