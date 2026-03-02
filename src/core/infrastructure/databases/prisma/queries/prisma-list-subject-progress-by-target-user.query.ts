import type {
  ListSubjectProgressByTargetUserQuery,
  TopicProgressDto,
} from '@/src/core/application/use-cases/subject';
import type { Mapper } from '@/src/core/domain/contracts';
import type { PrismaTopicWithProgress } from '@/src/core/infrastructure/databases/prisma/types';
import type { PrismaClient } from '@/src/generated/prisma/client';

type PrismaListSubjectProgressByTargetUserQueryDeps = {
  prisma: PrismaClient;
  mapper: Mapper<PrismaTopicWithProgress, TopicProgressDto>;
};

export class PrismaListSubjectProgressByTargetUserQuery implements ListSubjectProgressByTargetUserQuery {
  private readonly prisma: PrismaClient;
  private readonly mapper: Mapper<PrismaTopicWithProgress, TopicProgressDto>;

  constructor({
    prisma,
    mapper,
  }: PrismaListSubjectProgressByTargetUserQueryDeps) {
    this.prisma = prisma;
    this.mapper = mapper;
  }

  async execute({
    targetUserId,
    subjectSlug,
  }: {
    targetUserId: string;
    subjectSlug: string;
  }): Promise<TopicProgressDto[]> {
    const topics = await this.prisma.topic.findMany({
      where: {
        subject: {
          slug: subjectSlug,
        },
      },
      orderBy: {
        position: 'asc',
      },
      include: {
        userTopicProgresses: {
          where: {
            userId: targetUserId,
          },
        },
      },
    });

    return topics.map((topic) => this.mapper.map(topic));
  }
}
