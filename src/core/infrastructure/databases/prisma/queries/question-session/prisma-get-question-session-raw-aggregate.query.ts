import type {
  GetQuestionSessionRawAggregateQuery,
  QuestionSessionStatsRaw,
} from '@/src/core/application/use-cases/question-session';
import type { Mapper } from '@/src/core/domain/contracts';
import {
  type QuestionSessionStatsRawPrisma,
  questionSessionGroupByArgs,
} from '@/src/core/infrastructure/databases/prisma/contracts';
import type { PrismaClient } from '@/src/generated/prisma/client';

type PrismaGetQuestionSessionRawAggregateQueryDeps = {
  prisma: PrismaClient;
  mapper: Mapper<QuestionSessionStatsRawPrisma, QuestionSessionStatsRaw>;
};

export class PrismaGetQuestionSessionRawAggregateQuery implements GetQuestionSessionRawAggregateQuery {
  private readonly prisma: PrismaClient;
  private readonly mapper: Mapper<
    QuestionSessionStatsRawPrisma,
    QuestionSessionStatsRaw
  >;

  constructor({
    prisma,
    mapper,
  }: PrismaGetQuestionSessionRawAggregateQueryDeps) {
    this.prisma = prisma;
    this.mapper = mapper;
  }

  async execute(authorId: string): Promise<QuestionSessionStatsRaw> {
    const [dailyGroups, unreviewedSessions] = await Promise.all([
      this.prisma.questionSession.groupBy({
        ...questionSessionGroupByArgs,
        where: { authorId },
      }),

      this.prisma.questionSession.findMany({
        where: { authorId, isReviewed: false },
      }),
    ]);

    return this.mapper.map({
      dailyGroups,
      unreviewedSessions,
    });
  }
}
