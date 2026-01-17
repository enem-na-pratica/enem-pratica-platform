import { CreateEssay } from "@/src/core/application/interfaces/essay/create-essay-use-case.interface";
import { Essay } from "@/src/core/domain/essay/essay.entity";
import { CreateEssayDto, EssayResDto } from "@/src/core/application/dtos/essay";
import { Role, ROLES, hasAtLeastRole } from "@/src/core/domain/auth/roles";
import { ForbiddenError } from "@/src/core/domain/errors";
import { EssayRepository } from "@/src/core/domain/essay/essay.repository.interface";
import { CheckTeacherStudentRelQuery } from "@/src/core/application/queries/interfaces";
import { UserRepository } from "@/src/core/domain/user/user.repository.interface";
import { ToDtoMapper } from "@/src/core/domain/mapper";

export type CreateEssayUseCaseDeps = {
  essayRepository: EssayRepository;
  userRepository: UserRepository;
  relationChecker: CheckTeacherStudentRelQuery;
  mapper: ToDtoMapper<Essay, EssayResDto>;
}

export class CreateEssayUseCase implements CreateEssay {
  private readonly essayRepository: EssayRepository;
  private readonly userRepository: UserRepository;
  private readonly relationChecker: CheckTeacherStudentRelQuery;
  private readonly mapper: ToDtoMapper<Essay, EssayResDto>;

  constructor(deps: CreateEssayUseCaseDeps) {
    this.essayRepository = deps.essayRepository;
    this.userRepository = deps.userRepository;
    this.relationChecker = deps.relationChecker;
    this.mapper = deps.mapper;
  }

  async execute(request: CreateEssayDto): Promise<EssayResDto> {
    const { essayData, requesterId } = request;
    const requesterRole = request.requesterRole as Role;

    if (!essayData.authorId) {
      return await this.persistEssay({
        ...essayData,
        authorId: requesterId
      });
    }

    await this.userRepository.getById(essayData.authorId);

    if (hasAtLeastRole(ROLES.ADMIN, requesterRole)) {
      return await this.persistEssay({
        ...essayData,
        authorId: requesterId
      });
    }

    if (hasAtLeastRole(ROLES.TEACHER, requesterRole)) {
      const hasRelationship = await this.relationChecker.checkTeacherStudentRel({
        teacherId: requesterId,
        studentId: essayData.authorId
      });

      if (hasRelationship) {
        return await this.persistEssay({
          ...essayData,
          authorId: essayData.authorId
        });
      }
    }

    throw new ForbiddenError();
  }

  private async persistEssay(
    essayData: Required<CreateEssayDto["essayData"]>
  ): Promise<EssayResDto> {
    const essay = Essay.create({ ...essayData });
    const createdEssay = await this.essayRepository.create(essay);
    return this.mapper.toDto(createdEssay);
  }
}