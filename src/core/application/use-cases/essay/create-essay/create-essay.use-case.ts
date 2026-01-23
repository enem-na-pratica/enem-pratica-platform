import type { UseCase } from '@/src/core/application/common/interfaces';
import type { CreateEssayDto } from './create-essay.dto';
import type { EssayDto } from "@/src/core/application/common/dtos";
import type {
  EssayRepository,
  UserRepository,
  StudentTeacherRepository,
} from '@/src/core/domain/contracts/repositories';
import type { Mapper } from '@/src/core/domain/contracts/mappers';
import type { Role } from '@/src/core/domain/auth';
import type { User } from '@/src/core/domain/entities';
import { UserNotFoundError, ForbiddenError } from '@/src/core/domain/errors';
import { Essay } from '@/src/core/domain/entities';
import { hasHigherRole, hasExactRole, ROLES } from '@/src/core/domain/auth';

type Requester = {
  id: string;
  username: string;
  role: Role;
};

type CreateEssayInput = {
  data: CreateEssayDto;
  requester: Requester;
};

type CreateEssayUseCaseDeps = {
  essayRepository: EssayRepository;
  userRepository: UserRepository;
  studentTeacherRepository: StudentTeacherRepository;
  mapper: Mapper<Essay, EssayDto>;
}

export class CreateEssayUseCase implements UseCase<CreateEssayInput, EssayDto> {
  private readonly essayRepository: EssayRepository;
  private readonly userRepository: UserRepository;
  private readonly studentTeacherRepository: StudentTeacherRepository;
  private readonly mapper: Mapper<Essay, EssayDto>;

  constructor({
    essayRepository,
    userRepository,
    studentTeacherRepository,
    mapper
  }: CreateEssayUseCaseDeps) {
    this.essayRepository = essayRepository;
    this.userRepository = userRepository;
    this.studentTeacherRepository = studentTeacherRepository;
    this.mapper = mapper;
  }

  async execute({ data, requester }: CreateEssayInput): Promise<EssayDto> {
    const authorId = await this.getValidatedAuthorId({
      requester,
      authorUsername: data.authorUsername
    });

    return await this.persistEssay({ essayData: data, authorId });
  }

  private async getValidatedAuthorId({
    requester,
    authorUsername,
  }: {
    requester: Requester;
    authorUsername?: string;
  }): Promise<string> {
    if (!authorUsername || authorUsername === requester.username) {
      return requester.id;
    }

    const author = await this.findAuthorOrThrow(authorUsername);

    await this.ensureRequesterHasPermission({ requester, author });

    return author.id!;
  }

  private async persistEssay({
    essayData,
    authorId
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

  private async findAuthorOrThrow(authorUsername: string) {
    const author = await this.userRepository.findByUsername(authorUsername);
    if (!author) {
      throw new UserNotFoundError({
        fieldName: 'username',
        entityValue: authorUsername,
      });
    }
    return author;
  }

  private async ensureRequesterHasPermission({
    requester,
    author
  }: {
    requester: Requester;
    author: User;
  }) {
    if (!hasHigherRole(requester.role, author.role)) {
      throw new ForbiddenError("You do not have permission to create essays for users with an equivalent or higher role.");
    }

    if (hasExactRole(requester.role, ROLES.TEACHER)) {
      await this.validateTeacherStudentLink({
        studentId: author.id!,
        teacherId: requester.id
      });
    }
  }

  private async validateTeacherStudentLink({
    studentId,
    teacherId
  }: {
    studentId: string;
    teacherId: string;
  }) {
    const canAccessStudent = await this.studentTeacherRepository.
      isStudentAssignedToTeacher({
        studentId,
        teacherId
      });

    if (!canAccessStudent) {
      throw new ForbiddenError("You can only create essays for students who are assigned to you.");
    }
  }
}