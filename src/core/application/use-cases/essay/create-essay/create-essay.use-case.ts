import type { EssayDto } from '@/src/core/application/common/dtos';
import type { UseCase } from '@/src/core/application/common/interfaces';
import type { Mapper } from '@/src/core/domain/contracts/mappers';
import type { EssayRepository } from '@/src/core/domain/contracts/repositories';
import { Essay } from '@/src/core/domain/entities';
import type { Requester, UserAccessService } from '@/src/core/domain/services';

import type { CreateEssayDto } from './create-essay.dto';

export type CreateEssayInput = {
  data: CreateEssayDto;
  requester: Requester;
};

type CreateEssayUseCaseDeps = {
  essayRepository: EssayRepository;
  userAccessService: UserAccessService;
  mapper: Mapper<Essay, EssayDto>;
};

export class CreateEssayUseCase implements UseCase<CreateEssayInput, EssayDto> {
  private readonly essayRepository: EssayRepository;
  private readonly userAccessService: UserAccessService;
  private readonly mapper: Mapper<Essay, EssayDto>;

  constructor({
    essayRepository,
    userAccessService,
    mapper,
  }: CreateEssayUseCaseDeps) {
    this.essayRepository = essayRepository;
    this.userAccessService = userAccessService;
    this.mapper = mapper;
  }

  async execute({ data, requester }: CreateEssayInput): Promise<EssayDto> {
    const authorId = await this.userAccessService.resolveManagedTargetId({
      requester,
      targetIdentifier: data.authorUsername,
    });

    return await this.persistEssay({ essayData: data, authorId });
  }

  private async persistEssay({
    essayData,
    authorId,
  }: {
    essayData: CreateEssayDto;
    authorId: string;
  }): Promise<EssayDto> {
    const essay = Essay.create({
      authorId,
      theme: essayData.theme,
      competency1: essayData.grades.c1,
      competency2: essayData.grades.c2,
      competency3: essayData.grades.c3,
      competency4: essayData.grades.c4,
      competency5: essayData.grades.c5,
    });
    const createdEssay = await this.essayRepository.create(essay);
    return this.mapper.map(createdEssay);
  }
}
