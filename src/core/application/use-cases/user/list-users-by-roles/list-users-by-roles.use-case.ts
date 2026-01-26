import type { UseCase } from '@/src/core/application/common/interfaces';
import type { Role } from '@/src/core/domain/auth';
import type { ListUsersByRolesQuery } from './list-users-by-roles.query';
import type { UserDto } from "@/src/core/application//common/dtos";
import { ROLES, hasExactRole } from '@/src/core/domain/auth';
import { ForbiddenError } from '@/src/core/domain/errors';

export type ListUsersByRolesUseCaseDeps = {
  listUsersByRoles: ListUsersByRolesQuery;
}

export class ListUsersByRolesUseCase implements UseCase<Role, UserDto[]> {
  private readonly listUsersByRoles: ListUsersByRolesQuery;

  constructor({ listUsersByRoles }: ListUsersByRolesUseCaseDeps) {
    this.listUsersByRoles = listUsersByRoles;
  }

  async execute(role: Role): Promise<UserDto[]> {
    if (hasExactRole(role, ROLES.ADMIN)) {
      return await this.listUsersByRoles.execute([
        ROLES.STUDENT,
        ROLES.TEACHER
      ]);
    }

    if (hasExactRole(role, ROLES.SUPER_ADMIN)) {
      return await this.listUsersByRoles.execute([]);
    }

    throw new ForbiddenError();
  }
}
