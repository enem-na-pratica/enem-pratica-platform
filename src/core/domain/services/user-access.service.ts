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
 * Resolves "who is the target user of this request" and enforces
 * authorization rules based on the requester's role.
 *
 * This is the entry point for any use case where a requester (the
 * authenticated user) wants to act on behalf of themselves or another user
 * identified by a username, UUID, or omitted entirely (meaning "myself").
 *
 * Two resolution strategies are exposed, differing in how strict they are:
 *
 * - {@link resolveTargetId} — role hierarchy only. Use for actions where
 *   any sufficiently privileged role may act on any subordinate user
 *   (e.g. read-only lookups, admin operations).
 * - {@link resolveManagedTargetId} — role hierarchy *plus* explicit
 *   relationships. Use for actions where a teacher must additionally be
 *   linked to the specific student they're acting on.
 *
 * When in doubt about which one to use, prefer {@link resolveManagedTargetId}:
 * it's the stricter option and the safer default for anything that mutates
 * a student's data.
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
   * Resolves the target user's ID, checking only role hierarchy.
   *
   * @param params.requester - The authenticated user making the request.
   * @param params.targetIdentifier - The user being acted upon, as a
   *   username or UUID. Omit it (or pass the requester's own username/id)
   *   to target the requester themselves — no permission check is done
   *   in that case.
   *
   * @returns The resolved target user's ID.
   *
   * @throws {UserNotFoundError} If `targetIdentifier` is a username that
   *   doesn't match any user.
   * @throws {ForbiddenError} If the requester's role is not strictly
   *   higher than the target user's role.
   */
  async resolveTargetId(params: ResolveTargetParams): Promise<string> {
    return this.resolveTargetUser(params);
  }

  /**
   * Resolves the target user's ID, checking role hierarchy *and*,
   * when the requester is a teacher acting on someone else, that the
   * target student is explicitly assigned to that teacher.
   *
   * @param params.requester - The authenticated user making the request.
   * @param params.targetIdentifier - The user being acted upon, as a
   *   username or UUID. Omit it (or pass the requester's own username/id)
   *   to target the requester themselves — no permission check is done
   *   in that case.
   *
   * @returns The resolved target user's ID.
   *
   * @throws {UserNotFoundError} If `targetIdentifier` is a username that
   *   doesn't match any user.
   * @throws {ForbiddenError} If the requester's role is not strictly
   *   higher than the target user's role, or if the requester is a
   *   teacher not assigned to the target student.
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
