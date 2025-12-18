import { GetCurrentUserController } from "@/src/core/presentation/controllers/user/get-current-user.controller";
import { Controller } from "@/src/core/presentation/interfaces";
import { GetCurrentUserUseCase } from "@/src/core/application/use-cases/user/get-current-user.use-case";
import { makeUserPrismaRepository } from "@/src/core/main/factories/repositories/user-repository.factory";
import { UserDtoMapper } from "@/src/core/application/mapper/user-dto.mapper";

export function makeGetCurrentUserController(): Controller {
  const userRepository = makeUserPrismaRepository();
  const mapper = new UserDtoMapper();
  const getCurrentUserUseCase = new GetCurrentUserUseCase({
    userRepository,
    mapper
  });
  return new GetCurrentUserController({ getCurrentUserUseCase });
}