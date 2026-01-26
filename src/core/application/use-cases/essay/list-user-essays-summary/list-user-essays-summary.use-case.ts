import type { UseCase } from '@/src/core/application/common/interfaces';
import type {
  UserEssaysOverviewDto,
  EssayStatisticsDto
} from './user-essays-overview.dto';
import type { ListEssaysByAuthorQuery } from './list-essays-by-author.query';
import type { Role } from '@/src/core/domain/auth';
import type {
  UserRepository,
  StudentTeacherRepository,
} from '@/src/core/domain/contracts/repositories';
import type { User } from '@/src/core/domain/entities';
import type { EssayDto } from "@/src/core/application/common/dtos";
import { UserNotFoundError, ForbiddenError } from '@/src/core/domain/errors';
import { hasHigherRole, hasExactRole, ROLES } from '@/src/core/domain/auth';

type Requester = {
  id: string;
  username: string;
  role: Role;
};

export type ListUserEssaysSummaryInput = {
  authorUsername?: string;
  requester: Requester;
};

type ListUserEssaysSummaryUseCaseDeps = {
  userRepository: UserRepository;
  studentTeacherRepository: StudentTeacherRepository;
  listEssaysByAuthorQuery: ListEssaysByAuthorQuery;
}

export class ListUserEssaysSummaryUseCase
  implements UseCase<ListUserEssaysSummaryInput, UserEssaysOverviewDto> {
  private readonly userRepository: UserRepository;
  private readonly studentTeacherRepository: StudentTeacherRepository;
  private readonly listEssaysByAuthorQuery: ListEssaysByAuthorQuery;

  constructor({
    userRepository,
    studentTeacherRepository,
    listEssaysByAuthorQuery,
  }: ListUserEssaysSummaryUseCaseDeps) {
    this.userRepository = userRepository;
    this.studentTeacherRepository = studentTeacherRepository;
    this.listEssaysByAuthorQuery = listEssaysByAuthorQuery;
  }

  async execute({
    authorUsername,
    requester
  }: ListUserEssaysSummaryInput): Promise<UserEssaysOverviewDto> {
    const authorId = await this.getValidatedAuthorId({
      requester,
      authorUsername
    });

    const essays = await this.listEssaysByAuthorQuery.execute(authorId);

    const statistics = this.calculateStatistics(essays);

    return { statistics, essays };
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

  private calculateStatistics(essays: EssayDto[]): EssayStatisticsDto {
    const totalCount = essays.length;

    if (totalCount === 0) {
      return {
        totalCount: 0,
        globalAverage: 0,
        averagesPerCompetency: { c1: 0, c2: 0, c3: 0, c4: 0, c5: 0 },
      };
    }

    const initialTotals = { total: 0, c1: 0, c2: 0, c3: 0, c4: 0, c5: 0 };

    const totals = essays.reduce((acc, curr) => {
      (Object.keys(acc) as (keyof typeof acc)[]).forEach(key => {
        acc[key] += curr.grades[key];
      });
      return acc;
    }, { ...initialTotals });

    return {
      totalCount,
      globalAverage: totals.total / totalCount,
      averagesPerCompetency: {
        c1: totals.c1 / totalCount,
        c2: totals.c2 / totalCount,
        c3: totals.c3 / totalCount,
        c4: totals.c4 / totalCount,
        c5: totals.c5 / totalCount,
      },
    };
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
      throw new ForbiddenError("You do not have permission to view the statistics of a user with a higher or equal role.");
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
      throw new ForbiddenError("You can only access statistics for students who are assigned to you.");
    }
  }
}
