import { makeUserPrismaRepository } from "@/src/core/main/factories/repositories/user-repository.factory";
import { UserResDtoMapper } from "@/src/core/application/mapper/user-dto.mapper";
import { makePrismaUserQuery } from "@/src/core/main/factories/queries";
import { ListUsersUseCase } from "@/src/core/application/use-cases/user/list-users.use-case";
import { ListUsersController } from "@/src/core/presentation/controllers/user/list-users.controller";

export function makeListUsersController() {
  const userRepository = makeUserPrismaRepository();
  const userQuery = makePrismaUserQuery();
  const mapper = new UserResDtoMapper();

  const listUsersUseCase = new ListUsersUseCase({
    mapper,
    userQuery,
    userRepository
  });

  return new ListUsersController({ listUsersUseCase })
}