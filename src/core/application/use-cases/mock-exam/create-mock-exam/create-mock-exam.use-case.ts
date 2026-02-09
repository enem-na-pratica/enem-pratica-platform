import type { Requester, UseCase } from '@/src/core/application/common/interfaces';
import type { MockExamDto } from '@/src/core/application/common/dtos';
import type { CreateMockExamDto } from './create-mock-exam.dto';
import type {
  MockExamRepository,
  StudentTeacherRepository,
  UserRepository
} from '@/src/core/domain/contracts';
import type { Mapper } from '@/src/core/domain/contracts/mappers';
import { MockExam, type User } from '@/src/core/domain/entities';
import { ForbiddenError, UserNotFoundError } from '@/src/core/domain/errors';
import { hasExactRole, hasHigherRole, ROLES } from '@/src/core/domain/auth';

type CreateMockExamUseCaseDeps = {
  mockExamRepository: MockExamRepository;
  userRepository: UserRepository;
  studentTeacherRepository: StudentTeacherRepository;
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
  private readonly userRepository: UserRepository;
  private readonly studentTeacherRepository: StudentTeacherRepository;
  private readonly mapper: Mapper<MockExam, MockExamDto>;

  constructor({
    mockExamRepository,
    userRepository,
    studentTeacherRepository,
    mapper
  }: CreateMockExamUseCaseDeps) {
    this.mockExamRepository = mockExamRepository;
    this.userRepository = userRepository;
    this.studentTeacherRepository = studentTeacherRepository;
    this.mapper = mapper;
  }

  async execute({ data, requester }: CreateMockExamInput): Promise<MockExamDto> {
    const authorId = await this.getValidatedAuthorId({
      requester,
      authorUsername: data.authorUsername
    });

    return await this.persistMockExam({ mockExamData: data, authorId });
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
    if (!hasHigherRole({
      userRole: requester.role,
      targetRole: author.role,
    })) {
      throw new ForbiddenError("You do not have permission to create essays for users with an equivalent or higher role.");
    }

    if (hasExactRole({
      userRole: requester.role,
      expectedRole: ROLES.TEACHER,
    })) {
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