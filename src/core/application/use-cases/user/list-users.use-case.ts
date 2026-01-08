import { UserRepository } from "@/src/core/domain/user/user.repository.interface";
import { UserDTO } from "@/src/core/application/dtos/user";
import { ToDtoMapper } from "@/src/core/domain/mapper";
import { User } from "@/src/core/domain/user/user.entity";
import { ListUsers } from "@/src/core/application/interfaces/user/list-users-use-case.interface";
import { Role, ROLES } from "@/src/core/domain/auth/roles";
import {
  UsersByRolesQuery
} from "@/src/core/application/queries/interfaces";
import { ForbiddenError } from "@/src/core/domain/errors";

export type ListUsersUseCaseDeps = {
  userRepository: UserRepository;
  userQuery: UsersByRolesQuery;
  mapper: ToDtoMapper<User, UserDTO>
}

export class ListUsersUseCase implements ListUsers {
  private readonly userRepository: UserRepository;
  private readonly userQuery: UsersByRolesQuery;
  private readonly mapper: ToDtoMapper<User, UserDTO>;

  constructor(deps: ListUsersUseCaseDeps) {
    this.userRepository = deps.userRepository;
    this.userQuery = deps.userQuery
    this.mapper = deps.mapper;
  }

  async execute(role: Role): Promise<UserDTO[]> {
    if (role === ROLES.ADMIN) {
      const users = await this.userQuery.findUsersByRoles([
        ROLES.STUDENT,
        ROLES.TEACHER
      ]);

      return users.map((user) => this.mapper.toDto(user));
    }

    if (role === ROLES.SUPER_ADMIN) {
      const users = await this.userRepository.findAll();

      return users.map((user) => this.mapper.toDto(user));
    }

    throw new ForbiddenError();
  }
}