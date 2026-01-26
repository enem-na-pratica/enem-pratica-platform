import { GetAuthenticatedUserController } from '@/src/core/presentation/controllers/user';
import { GetAuthenticatedUserUseCase } from '@/src/core/application/use-cases/user';
import { makeUserDtoMapper } from '@/src/core/main/factories/common/mappers';
import { makePrismaUserRepository } from '@/src/core/main/factories/common/repositories';

export function makeGetAuthenticatedUserController() {
  const getAuthenticatedUserUseCase = new GetAuthenticatedUserUseCase({
    mapper: makeUserDtoMapper(),
    userRepository: makePrismaUserRepository(),
  });

  return new GetAuthenticatedUserController({
    getAuthenticatedUserUseCase,
  });
}