import type { Role } from '@/src/core/domain/auth';
import { ROLES, hasExactRole, hasHigherRole } from '@/src/core/domain/auth';
import type {
  StudentTeacherRepository,
  UserRepository,
} from '@/src/core/domain/contracts/repositories';
import type { User } from '@/src/core/domain/entities';
import { ForbiddenError, UserNotFoundError } from '@/src/core/domain/errors';

export type Requester = {
  id: string;
  username: string;
  role: Role;
};

type ResolveTargetParams = {
  requester: Requester;
  targetIdentifier?: string;
};

type UserAccessServiceDeps = {
  userRepository: UserRepository;
  studentTeacherRepository: StudentTeacherRepository;
};

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
  async resolveTargetId(params: ResolveTargetParams): Promise<string> {
    return this.resolveTargetUser(params);
  }

  /**
   * Resolves the target user ID by validating both role hierarchy
   * and explicit management relationships.
   *
   * If the requester is a Teacher, they are only allowed to act
   * on students explicitly assigned to them.
   */
  async resolveManagedTargetId(params: ResolveTargetParams): Promise<string> {
    const authorId = await this.resolveTargetUser(params);
    const { requester } = params;

    if (
      authorId !== requester.id &&
      hasExactRole({
        userRole: requester.role,
        expectedRole: ROLES.TEACHER,
      })
    ) {
      await this.validateTeacherStudentLink({
        studentId: authorId,
        teacherId: requester.id,
      });
    }

    return authorId;
  }

  private async resolveTargetUser({
    requester,
    targetIdentifier,
  }: ResolveTargetParams): Promise<string> {
    // Use case: the requester is acting on their own behalf
    if (!targetIdentifier) return requester.id;
    if (targetIdentifier === requester.username) return requester.id;
    if (targetIdentifier === requester.id) return requester.id;

    const targetUser = this.isUUID(targetIdentifier)
      ? await this.userRepository.getById(targetIdentifier)
      : await this.findUserByUsernameOrThrow(targetIdentifier);

    this.ensureRequesterHasPermission({ requester, targetUser });

    return targetUser.id!;
  }

  private isUUID(value: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
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
    targetUser,
  }: {
    requester: Requester;
    targetUser: User;
  }) {
    if (
      !hasHigherRole({
        userRole: requester.role,
        targetRole: targetUser.role,
      })
    ) {
      throw new ForbiddenError(
        'You do not have permission to perform actions for users with an equivalent or higher role.',
      );
    }
  }

  private async validateTeacherStudentLink({
    studentId,
    teacherId,
  }: {
    studentId: string;
    teacherId: string;
  }): Promise<void> {
    const canAccessStudent =
      await this.studentTeacherRepository.isStudentAssignedToTeacher({
        studentId,
        teacherId,
      });

    if (!canAccessStudent) {
      throw new ForbiddenError(
        'You do not have permission to perform this action for students who are not assigned to you.',
      );
    }
  }
}
