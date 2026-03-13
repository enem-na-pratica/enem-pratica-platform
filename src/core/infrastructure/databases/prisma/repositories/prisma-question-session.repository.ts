import type { Mapper } from '@/src/core/domain/contracts/mappers';
import type { QuestionSessionRepository } from '@/src/core/domain/contracts/repositories';
import type { QuestionSession } from '@/src/core/domain/entities';
import { NotFoundError } from '@/src/core/domain/errors';
import type {
  PrismaClient,
  QuestionSession as PrismaQuestionSession,
} from '@/src/generated/prisma/client';

type PrismaQuestionSessionRepositoryDeps = {
  prisma: PrismaClient;
  mapper: Mapper<PrismaQuestionSession, QuestionSession>;
};

export class PrismaQuestionSessionRepository implements QuestionSessionRepository {
  private readonly prisma: PrismaClient;
  private readonly mapper: Mapper<PrismaQuestionSession, QuestionSession>;

  constructor({ prisma, mapper }: PrismaQuestionSessionRepositoryDeps) {
    this.prisma = prisma;
    this.mapper = mapper;
  }

  async create(questionSession: QuestionSession): Promise<QuestionSession> {
    const newQuestionSession = await this.prisma.questionSession.create({
      data: {
        date: questionSession.date,
        total: questionSession.total,
        correct: questionSession.correct,
        isReviewed: questionSession.isReviewed,
        author: { connect: { id: questionSession.authorId } },
        topic: { connect: { id: questionSession.topicId } },
      },
    });

    return this.mapper.map(newQuestionSession);
  }

  async getById(questionSessionId: string): Promise<QuestionSession> {
    const questionSession = await this.prisma.questionSession.findUnique({
      where: { id: questionSessionId },
    });

    if (!questionSession)
      throw new NotFoundError({
        entityName: 'QuestionSession',
        fieldName: 'id',
        entityValue: questionSessionId,
      });

    return this.mapper.map(questionSession);
  }

  setIsReviewed({
    questionSessionId,
    status,
  }: {
    questionSessionId: string;
    status: boolean;
  }): Promise<QuestionSession> {
    throw new Error('Method not implemented.');
  }
}
