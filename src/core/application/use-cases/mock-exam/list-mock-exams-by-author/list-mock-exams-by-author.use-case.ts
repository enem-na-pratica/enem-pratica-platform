import type { MockExamDto } from '@/src/core/application/common/dtos';
import type { UseCase } from '@/src/core/application/common/interfaces';
import type { Requester, UserAccessService } from '@/src/core/domain/services';

import type { ListMockExamsByAuthorQuery } from './list-mock-exams-by-author.query';

export type ListMockExamsByAuthorUseCaseInput = {
  authorUsername?: string;
  requester: Requester;
};

type ListMockExamsByAuthorUseCaseDeps = {
  userAccessService: UserAccessService;
  listMockExamsByAuthorQuery: ListMockExamsByAuthorQuery;
};

export class ListMockExamsByAuthorUseCase implements UseCase<
  ListMockExamsByAuthorUseCaseInput,
  MockExamDto[]
> {
  private readonly userAccessService: UserAccessService;
  private readonly listMockExamsByAuthorQuery: ListMockExamsByAuthorQuery;

  constructor({
    userAccessService,
    listMockExamsByAuthorQuery,
  }: ListMockExamsByAuthorUseCaseDeps) {
    this.userAccessService = userAccessService;
    this.listMockExamsByAuthorQuery = listMockExamsByAuthorQuery;
  }

  async execute({
    requester,
    authorUsername,
  }: ListMockExamsByAuthorUseCaseInput): Promise<MockExamDto[]> {
    const authorId = await this.userAccessService.resolveManagedTargetId({
      requester,
      targetIdentifier: authorUsername,
    });

    const mockExams = await this.listMockExamsByAuthorQuery.execute(authorId);

    return mockExams;
  }
}
