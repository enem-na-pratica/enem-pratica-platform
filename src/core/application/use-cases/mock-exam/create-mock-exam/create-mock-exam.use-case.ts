import type { UseCase } from '@/src/core/application/common/interfaces';
import type { MockExamDto } from '@/src/core/application/common/dtos';
import type { CreateMockExamDto } from './create-mock-exam.dto';
import type { MockExamRepository } from '@/src/core/domain/contracts';
import type { Mapper } from '@/src/core/domain/contracts/mappers';
import type { UserAccessService, Requester } from '@/src/core/domain/services';
import { MockExam } from '@/src/core/domain/entities';

type CreateMockExamUseCaseDeps = {
  mockExamRepository: MockExamRepository;
  userAccessService: UserAccessService;
  mapper: Mapper<MockExam, MockExamDto>;
}

type CreateMockExamInput = {
  data: CreateMockExamDto;
  requester: Requester;
}

export class CreateMockExamUseCase implements UseCase<
  CreateMockExamInput,
  MockExamDto
> {
  private readonly mockExamRepository: MockExamRepository;
  private readonly userAccessService: UserAccessService;
  private readonly mapper: Mapper<MockExam, MockExamDto>;

  constructor({
    mockExamRepository,
    userAccessService,
    mapper
  }: CreateMockExamUseCaseDeps) {
    this.mockExamRepository = mockExamRepository;
    this.userAccessService = userAccessService;
    this.mapper = mapper;
  }

  async execute({ data, requester }: CreateMockExamInput): Promise<MockExamDto> {
    const authorId = await this.userAccessService.resolveManagedTargetId({
      requester,
      targetUsername: data.authorUsername
    });

    return await this.persistMockExam({ mockExamData: data, authorId });
  }

  private async persistMockExam({
    mockExamData,
    authorId
  }: {
    mockExamData: CreateMockExamDto;
    authorId: string;
  }): Promise<MockExamDto> {
    const mockExam = MockExam.create({
      authorId,
      title: mockExamData.title,
      performances: mockExamData.performances
    });

    const createdMockExam = await this.mockExamRepository.create(mockExam);

    return this.mapper.map(createdMockExam);
  }
}