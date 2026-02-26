import type {
  ListSubjectProgressByTargetQuery,
  TopicProgressDto,
} from '@/src/core/application/use-cases/subject';
import type { Mapper } from '@/src/core/domain/contracts';
import type { PrismaTopicWithProgress } from '@/src/core/infrastructure/databases/prisma/types';
import type { PrismaClient } from '@/src/generated/prisma/client';

type PrismaListSubjectProgressByTargetQueryDeps = {
  prisma: PrismaClient;
  mapper: Mapper<PrismaTopicWithProgress, TopicProgressDto>;
};

export class PrismaListSubjectProgressByTargetQuery implements ListSubjectProgressByTargetQuery {
  private readonly prisma: PrismaClient;
  private readonly mapper: Mapper<PrismaTopicWithProgress, TopicProgressDto>;

  constructor({ prisma, mapper }: PrismaListSubjectProgressByTargetQueryDeps) {
    this.prisma = prisma;
    this.mapper = mapper;
  }

  async execute({
    targetId,
    subjectName,
  }: {
    targetId: string;
    subjectName: string;
  }): Promise<TopicProgressDto[]> {
    const topics = await this.prisma.topic.findMany({
      where: {
        subject: {
          name: subjectName,
        },
      },
      orderBy: {
        position: 'asc',
      },
      include: {
        userTopicProgresses: {
          where: {
            userId: targetId,
          },
        },
      },
    });

    return topics.map((topic) => this.mapper.map(topic));
  }
}
