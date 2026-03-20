import type {
  ListQuestionSessionsByAuthorQuery,
  QuestionSessionWithTopicAndSubjectDto,
} from '@/src/core/application/use-cases/question-session/list-user-question-session-statistics';
import type { Mapper } from '@/src/core/domain/contracts/mappers';
import type { PrismaQuestionSessionWithTopicAndSubject } from '@/src/core/infrastructure/databases/prisma/types';
import { prismaQuestionSessionWithTopicAndSubjectInclude } from '@/src/core/infrastructure/databases/prisma/types';
import type { PrismaClient } from '@/src/generated/prisma/client';

type PrismaListQuestionSessionsByAuthorQueryDeps = {
  prisma: PrismaClient;
  mapper: Mapper<
    PrismaQuestionSessionWithTopicAndSubject,
    QuestionSessionWithTopicAndSubjectDto
  >;
};

export class PrismaListQuestionSessionsByAuthorQuery implements ListQuestionSessionsByAuthorQuery {
  private readonly prisma: PrismaClient;
  private readonly mapper: Mapper<
    PrismaQuestionSessionWithTopicAndSubject,
    QuestionSessionWithTopicAndSubjectDto
  >;

  constructor({ prisma, mapper }: PrismaListQuestionSessionsByAuthorQueryDeps) {
    this.prisma = prisma;
    this.mapper = mapper;
  }

  async execute(
    authorId: string,
  ): Promise<QuestionSessionWithTopicAndSubjectDto[]> {
    const questionSessions = await this.prisma.questionSession.findMany({
      where: { authorId },
      include: prismaQuestionSessionWithTopicAndSubjectInclude,
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    });

    return questionSessions.map((s) => this.mapper.map(s));
  }
}
