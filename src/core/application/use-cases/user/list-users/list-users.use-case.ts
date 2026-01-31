import type { UseCase } from '@/src/core/application/common/interfaces';
import type { Role } from '@/src/core/domain/auth';
import type { ListUsersQuery } from './list-users.query';
import type { UserDto } from "@/src/core/application//common/dtos";
import { ROLES, hasExactRole } from '@/src/core/domain/auth';
import { ForbiddenError } from '@/src/core/domain/errors';

export type ListUsersUseCaseDeps = {
  listUsers: ListUsersQuery;
}

export class ListUsersUseCase implements UseCase<Role, UserDto[]> {
  private readonly listUsers: ListUsersQuery;

  constructor({ listUsers }: ListUsersUseCaseDeps) {
    this.listUsers = listUsers;
  }

  async execute(role: Role): Promise<UserDto[]> {
    if (hasExactRole(role, ROLES.ADMIN)) {
      return await this.listUsers.execute([
        ROLES.STUDENT,
        ROLES.TEACHER
      ]);
    }

    if (hasExactRole(role, ROLES.SUPER_ADMIN)) {
      return await this.listUsers.execute([]);
    }

    throw new ForbiddenError();
  }
}
