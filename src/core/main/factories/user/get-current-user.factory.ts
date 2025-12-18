import { GetCurrentUserController } from "@/src/core/presentation/controllers/user/get-current-user.controller";
import { Controller } from "@/src/core/presentation/interfaces";
import { GetCurrentUserUseCase } from "@/src/core/application/use-cases/user/get-current-user.use-case";
import { UserToDTOMapper } from "@/src/core/infrastructure/mapper/user-to-dto.mapper";
import { makeUserPrismaRepository } from "@/src/core/main/factories/repositories/user-repository.factory";

export function makeGetCurrentUserController(): Controller {
  const userRepository = makeUserPrismaRepository();
  const mapper = new UserToDTOMapper();
  const getCurrentUserUseCase = new GetCurrentUserUseCase({
    userRepository,
    mapper
  });
  return new GetCurrentUserController({ getCurrentUserUseCase });
}