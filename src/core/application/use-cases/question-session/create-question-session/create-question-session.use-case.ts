import type { QuestionSessionDto } from '@/src/core/application/common/dtos';
import type { UseCase } from '@/src/core/application/common/interfaces';
import type { Mapper } from '@/src/core/domain/contracts/mappers';
import type { QuestionSessionRepository } from '@/src/core/domain/contracts/repositories';
import { QuestionSession } from '@/src/core/domain/entities';
import type { Requester, UserAccessService } from '@/src/core/domain/services';

import type { CreateQuestionSessionDto } from './create-question-session.dto';

type CreateQuestionSessionUseCaseDeps = {
  questionSessionRepository: QuestionSessionRepository;
  userAccessService: UserAccessService;
  mapper: Mapper<QuestionSession, QuestionSessionDto>;
};

export type CreateQuestionSessionInput = {
  data: CreateQuestionSessionDto;
  requester: Requester;
};

export class CreateQuestionSessionUseCase implements UseCase<
  CreateQuestionSessionInput,
  QuestionSessionDto
> {
  private readonly questionSessionRepository: QuestionSessionRepository;
  private readonly userAccessService: UserAccessService;
  private readonly mapper: Mapper<QuestionSession, QuestionSessionDto>;

  constructor({
    questionSessionRepository,
    userAccessService,
    mapper,
  }: CreateQuestionSessionUseCaseDeps) {
    this.questionSessionRepository = questionSessionRepository;
    this.userAccessService = userAccessService;
    this.mapper = mapper;
  }

  async execute({
    data,
    requester,
  }: CreateQuestionSessionInput): Promise<QuestionSessionDto> {
    const authorId = await this.userAccessService.resolveManagedTargetId({
      requester,
      targetUsername: data.authorUsername,
    });

    return await this.persistQuestionSession({
      questionSessionData: data,
      authorId,
    });
  }

  private async persistQuestionSession({
    questionSessionData,
    authorId,
  }: {
    questionSessionData: CreateQuestionSessionDto;
    authorId: string;
  }): Promise<QuestionSessionDto> {
    const questionSession = QuestionSession.create({
      authorId: authorId,
      topicId: questionSessionData.topicId,
      date: questionSessionData.date,
      total: questionSessionData.total,
      correct: questionSessionData.correct,
      isReviewed: questionSessionData.isReviewed,
    });

    const createdQuestionSession =
      await this.questionSessionRepository.create(questionSession);

    return this.mapper.map(createdQuestionSession);
  }
}
