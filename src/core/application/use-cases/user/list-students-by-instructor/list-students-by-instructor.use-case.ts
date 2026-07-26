import type { UserDto } from '@/src/core/application/common/dtos';
import type { UseCase } from '@/src/core/application/common/interfaces';
import { ROLES, hasExactRole } from '@/src/core/domain/auth';
import { ForbiddenError } from '@/src/core/domain/errors';
import type { Requester, UserAccessService } from '@/src/core/domain/services';

import type { ListStudentsByInstructorQuery } from './list-students-by-instructor.query';

type ListStudentsByInstructorDeps = {
  listStudentsByInstructor: ListStudentsByInstructorQuery;
  userAccessService: UserAccessService;
};

export type ListStudentsByInstructorInput = {
  instructorUsername?: string;
  requester: Requester;
};

export class ListStudentsByInstructorUseCase implements UseCase<
  ListStudentsByInstructorInput,
  UserDto[]
> {
  private readonly listStudentsByInstructor: ListStudentsByInstructorQuery;
  private readonly userAccessService: UserAccessService;

  constructor({
    listStudentsByInstructor,
    userAccessService,
  }: ListStudentsByInstructorDeps) {
    this.listStudentsByInstructor = listStudentsByInstructor;
    this.userAccessService = userAccessService;
  }

  async execute({
    instructorUsername,
    requester,
  }: ListStudentsByInstructorInput): Promise<UserDto[]> {
    if (
      hasExactRole({ userRole: requester.role, expectedRole: ROLES.STUDENT })
    ) {
      throw new ForbiddenError();
    }

    const instructorId = await this.userAccessService.resolveManagedTargetId({
      requester,
      targetIdentifier: instructorUsername,
    });

    return await this.listStudentsByInstructor.execute(instructorId);
  }
}
