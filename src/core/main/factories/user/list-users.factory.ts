import { makeUserPrismaRepository } from "@/src/core/main/factories/repositories/user-repository.factory";
import { UserDtoMapper } from "@/src/core/application/mapper/user-dto.mapper";
import { makeUserPrismaService } from "@/src/core/main/factories/queries/user-service.factory";
import { ListUsersUseCase } from "@/src/core/application/use-cases/user/list-users.use-case";
import { ListUsersController } from "@/src/core/presentation/controllers/user/list-users.controller";

export function makeListUsersController() {
  const userRepository = makeUserPrismaRepository();
  const userQuery = makeUserPrismaService();
  const mapper = new UserDtoMapper();

  const listUsersUseCase = new ListUsersUseCase({
    mapper,
    userQuery,
    userRepository
  });

  return new ListUsersController({ listUsersUseCase })
}