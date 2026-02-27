import type { Role } from '@/src/core/domain/auth';
import type {
  UserRepository,
  StudentTeacherRepository,
} from '@/src/core/domain/contracts/repositories';
import type { User } from '@/src/core/domain/entities';
import { UserNotFoundError, ForbiddenError } from '@/src/core/domain/errors';
import { hasHigherRole, hasExactRole, ROLES } from '@/src/core/domain/auth';

export type Requester = {
  id: string;
  username: string;
  role: Role;
};

type UserAccessServiceDeps = {
  userRepository: UserRepository;
  studentTeacherRepository: StudentTeacherRepository;
}

/**
 * Service responsible for resolving target users and validating
 * access rules based on role hierarchy and explicit relationships.
 */
export class UserAccessService {
  private readonly userRepository: UserRepository;
  private readonly studentTeacherRepository: StudentTeacherRepository;

  constructor({
    userRepository,
    studentTeacherRepository,
  }: UserAccessServiceDeps) {
    this.userRepository = userRepository;
    this.studentTeacherRepository = studentTeacherRepository;
  }

  /**
   * Resolves the target user ID by validating only role hierarchy.
   *
   * Useful for read-only or administrative operations where
   * higher roles are allowed to access any subordinate user.
   */
  async resolveTargetId({
    requester,
    targetUsername
  }: {
    requester: Requester,
    targetUsername?: string
  }): Promise<string> {
    return this.resolveTargetUser({
      requester,
      targetUsername,
    });
  }

  /**
   * Resolves the target user ID by validating both role hierarchy
   * and explicit management relationships.
   *
   * If the requester is a Teacher, they are only allowed to act
   * on students explicitly assigned to them.
   */
  async resolveManagedTargetId({
    requester,
    targetUsername
  }: {
    requester: Requester,
    targetUsername?: string
  }): Promise<string> {
    const authorId = await this.resolveTargetUser({
      requester,
      targetUsername
    });

    if (authorId !== requester.id && hasExactRole({
      userRole: requester.role,
      expectedRole: ROLES.TEACHER
    })) {
      await this.validateTeacherStudentLink({
        studentId: authorId,
        teacherId: requester.id
      });
    }

    return authorId;
  }

  private async resolveTargetUser({
    requester,
    targetUsername
  }: {
    requester: Requester;
    targetUsername?: string;
  }): Promise<string> {
    // Use case: the requester is acting on their own behalf
    if (!targetUsername || targetUsername === requester.username) {
      return requester.id;
    }

    const targetUser = await this.findUserByUsernameOrThrow(targetUsername);

    this.ensureRequesterHasPermission({ requester, targetUser });

    return targetUser.id!;
  }

  private async findUserByUsernameOrThrow(authorUsername: string) {
    const author = await this.userRepository.findByUsername(authorUsername);
    if (!author) {
      throw new UserNotFoundError({
        fieldName: 'username',
        entityValue: authorUsername,
      });
    }
    return author;
  }

  private ensureRequesterHasPermission({
    requester,
    targetUser
  }: {
    requester: Requester;
    targetUser: User;
  }) {
    if (!hasHigherRole({
      userRole: requester.role,
      targetRole: targetUser.role,
    })) {
      throw new ForbiddenError("You do not have permission to perform actions for users with an equivalent or higher role.");
    }
  }

  private async validateTeacherStudentLink({
    studentId,
    teacherId
  }: {
    studentId: string;
    teacherId: string;
  }): Promise<void> {
    const canAccessStudent = await this.studentTeacherRepository.isStudentAssignedToTeacher({
      studentId,
      teacherId
    });

    if (!canAccessStudent) {
      throw new ForbiddenError("You do not have permission to perform this action for students who are not assigned to you.");
    }
  }
}