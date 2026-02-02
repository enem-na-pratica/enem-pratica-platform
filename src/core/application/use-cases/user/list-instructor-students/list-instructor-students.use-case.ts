import type { UseCase, Requester } from '@/src/core/application/common/interfaces';
import type { UserDto } from "@/src/core/application/common/dtos";
import type {
  ListStudentsByInstructorQuery
} from './list-students-by-instructor.query';
import type { UserRepository } from '@/src/core/domain/contracts/repositories';
import { ForbiddenError, UserNotFoundError } from '@/src/core/domain/errors';
import type { User } from '@/src/core/domain/entities';
import { hasHigherRole } from '@/src/core/domain/auth';

type ListStudentsByInstructorDeps = {
  listStudentsByInstructor: ListStudentsByInstructorQuery;
  userRepository: UserRepository;
}

export type ListStudentsByInstructorInput = {
  instructorUsername?: string,
  requester: Requester;
}

export class ListStudentsByInstructorUseCase
  implements UseCase<ListStudentsByInstructorInput, UserDto[]> {
  private readonly listStudentsByInstructor: ListStudentsByInstructorQuery;
  private readonly userRepository: UserRepository;

  constructor({
    listStudentsByInstructor,
    userRepository
  }: ListStudentsByInstructorDeps) {
    this.listStudentsByInstructor = listStudentsByInstructor
    this.userRepository = userRepository
  }

  async execute({
    instructorUsername,
    requester
  }: ListStudentsByInstructorInput): Promise<UserDto[]> {
    const instructorId = await this.getValidatedAuthorId({
      requester,
      instructorUsername
    });

    return await this.listStudentsByInstructor.execute(instructorId);
  }

  private async getValidatedAuthorId({
    requester,
    instructorUsername,
  }: {
    requester: Requester;
    instructorUsername?: string;
  }): Promise<string> {
    if (!instructorUsername || instructorUsername === requester.username) {
      return requester.id;
    }

    const instructor = await this.findInstructorOrThrow(instructorUsername);

    await this.ensureRequesterHasPermission({ instructor, requester });

    return instructor.id!;
  }

  private async findInstructorOrThrow(instructorUsername: string): Promise<User> {
    const instructor = await this.userRepository.findByUsername(instructorUsername);
    if (!instructor) {
      throw new UserNotFoundError({
        fieldName: 'username (Instructor)',
        entityValue: instructorUsername
      });
    }
    return instructor;
  }

  private async ensureRequesterHasPermission({
    requester,
    instructor
  }: {
    requester: Requester;
    instructor: User;
  }): Promise<void> {
    if (
      !hasHigherRole({
        userRole: requester.role,
        targetRole: instructor.role,
      })
    ) {
      throw new ForbiddenError(
        "You do not have permission to view the students of a user with the same or higher role."
      );
    }
  }
}