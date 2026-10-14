import type { UseCase } from '@/src/core/application/common/interfaces';
import type { Requester, UserAccessService } from '@/src/core/domain/services';

import type { ListQuestionSessionsByAuthorQuery } from './list-question-sessions-by-author.query';
import type { QuestionSessionExtendedDto } from './question-session-extended.dto';

type ListQuestionSessionsByAuthorUseCaseDeps = {
  userAccessService: UserAccessService;
  listQuestionSessionsByAuthorQuery: ListQuestionSessionsByAuthorQuery;
};

export type ListQuestionSessionsByAuthorInput = {
  authorUsername?: string;
  requester: Requester;
};

export class ListQuestionSessionsByAuthorUseCase implements UseCase<
  ListQuestionSessionsByAuthorInput,
  QuestionSessionExtendedDto[]
> {
  private readonly userAccessService: UserAccessService;
  private readonly listQuestionSessionsByAuthorQuery: ListQuestionSessionsByAuthorQuery;

  constructor({
    userAccessService,
    listQuestionSessionsByAuthorQuery,
  }: ListQuestionSessionsByAuthorUseCaseDeps) {
    this.userAccessService = userAccessService;
    this.listQuestionSessionsByAuthorQuery = listQuestionSessionsByAuthorQuery;
  }

  async execute({
    requester,
    authorUsername,
  }: ListQuestionSessionsByAuthorInput): Promise<QuestionSessionExtendedDto[]> {
    const authorId = await this.userAccessService.resolveManagedTargetId({
      requester,
      targetIdentifier: authorUsername,
    });

    const sessions =
      await this.listQuestionSessionsByAuthorQuery.execute(authorId);

    return this.sortSessionsByNextReviewDate(sessions);
  }

  /**
   * Sort priority:
   * 1. Sessions with nextReviewDate come first.
   * 2. Among sessions pending review, earlier nextReviewDate has higher priority.
   * 3. Sessions without nextReviewDate are sorted by updatedAt (most recent first).
   *
   * Tie-breakers:
   * 4. date descending (most recent first).
   * 5. createdAt descending (newest first).
   */
  private sortSessionsByNextReviewDate(
    sessions: QuestionSessionExtendedDto[],
  ): QuestionSessionExtendedDto[] {
    return [...sessions].sort((a, b) => {
      const aHasReview = a.nextReviewDate !== null;

      const bHasReview = b.nextReviewDate !== null;

      if (aHasReview !== bHasReview) return aHasReview ? -1 : 1;

      if (!aHasReview && !bHasReview) {
        const diff =
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();

        if (diff !== 0) return diff;
      } else {
        const diff =
          new Date(a.nextReviewDate!).getTime() -
          new Date(b.nextReviewDate!).getTime();

        if (diff !== 0) return diff;
      }

      const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();

      if (dateDiff !== 0) return dateDiff;

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }
}
