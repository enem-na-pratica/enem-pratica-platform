import type {
  ListQuestionSessionsByAuthorQuery,
  QuestionSessionExtendedDto,
} from '@/src/core/application/use-cases/question-session';
import type { Mapper } from '@/src/core/domain/contracts/mappers';
import {
  type PrismaQuestionSessionExtended,
  prismaQuestionSessionExtended,
} from '@/src/core/infrastructure/databases/prisma/contracts/includes';
import type { PrismaClient } from '@/src/generated/prisma/client';

type PrismaListQuestionSessionsByAuthorQueryDeps = {
  prisma: PrismaClient;
  mapper: Mapper<PrismaQuestionSessionExtended, QuestionSessionExtendedDto>;
};

export class PrismaListQuestionSessionsByAuthorQuery implements ListQuestionSessionsByAuthorQuery {
  private readonly prisma: PrismaClient;
  private readonly mapper: Mapper<
    PrismaQuestionSessionExtended,
    QuestionSessionExtendedDto
  >;

  constructor({ prisma, mapper }: PrismaListQuestionSessionsByAuthorQueryDeps) {
    this.prisma = prisma;
    this.mapper = mapper;
  }

  async execute(authorId: string): Promise<QuestionSessionExtendedDto[]> {
    const questionSessions = await this.prisma.questionSession.findMany({
      where: { authorId },
      include: prismaQuestionSessionExtended,
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    });

    return questionSessions.map((s) => this.mapper.map(s));
  }
}
