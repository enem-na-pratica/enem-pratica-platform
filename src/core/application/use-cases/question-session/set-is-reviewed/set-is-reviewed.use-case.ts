import type { QuestionSessionDto } from '@/src/core/application/common/dtos';
import type { UseCase } from '@/src/core/application/common/interfaces';
import type { Mapper } from '@/src/core/domain/contracts/mappers';
import type { QuestionSessionRepository } from '@/src/core/domain/contracts/repositories';
import { QuestionSession } from '@/src/core/domain/entities';
import type { Requester, UserAccessService } from '@/src/core/domain/services';

import type { SetIsReviewedDto } from './set-is-reviewed.dto';

type SetIsReviewedUseCaseDeps = {
  questionSessionRepository: QuestionSessionRepository;
  userAccessService: UserAccessService;
  mapper: Mapper<QuestionSession, QuestionSessionDto>;
};

export type SetIsReviewedInput = {
  data: SetIsReviewedDto;
  requester: Requester;
};

export class SetIsReviewedUseCase implements UseCase<
  SetIsReviewedInput,
  QuestionSessionDto
> {
  private readonly questionSessionRepository: QuestionSessionRepository;
  private readonly userAccessService: UserAccessService;
  private readonly mapper: Mapper<QuestionSession, QuestionSessionDto>;

  constructor({
    questionSessionRepository,
    userAccessService,
    mapper,
  }: SetIsReviewedUseCaseDeps) {
    this.questionSessionRepository = questionSessionRepository;
    this.userAccessService = userAccessService;
    this.mapper = mapper;
  }

  async execute({
    data,
    requester,
  }: SetIsReviewedInput): Promise<QuestionSessionDto> {
    const questionSession = await this.questionSessionRepository.getById(
      data.questionSessionId,
    );

    const authorId = await this.userAccessService.resolveManagedTargetId({
      requester,
      targetId: questionSession.authorId,
    });

    const questionSessionNew =
      await this.questionSessionRepository.setIsReviewed({
        questionSessionId: authorId,
        status: data.isReviewed,
      });

    return this.mapper.map(questionSessionNew);
  }
}
