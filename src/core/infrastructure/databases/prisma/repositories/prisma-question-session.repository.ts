import type { Mapper } from '@/src/core/domain/contracts/mappers';
import type { QuestionSessionRepository } from '@/src/core/domain/contracts/repositories';
import type { QuestionSession } from '@/src/core/domain/entities';
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

  getById(questionSessionId: string): Promise<QuestionSession> {
    throw new Error('Method not implemented.');
  }
}
