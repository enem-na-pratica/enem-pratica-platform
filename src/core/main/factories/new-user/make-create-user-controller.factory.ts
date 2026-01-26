import { CreateUserController } from '@/src/core/presentation/controllers/user';
import { CreateUserUseCase } from '@/src/core/application/use-cases/user';
import { BcryptAdapter } from '@/src/core/infrastructure/crypto';
import { UserDtoMapper } from '@/src/core/application/mapper';
import { makePrismaUserRepository } from '@/src/core/main/factories/repositories';
import {
  ZodValidator,
  createUserSchema
} from '@/src/core/infrastructure/validation/zod';


export function makeCreateUserController() {
  const bcryptAdapter = new BcryptAdapter();
  const userDtoMapper = new UserDtoMapper();
  const createUserUseCase = new CreateUserUseCase({
    hasher: bcryptAdapter,
    mapper: userDtoMapper,
    userRepository: makePrismaUserRepository(),
  });

  const zodValidator = new ZodValidator(createUserSchema);

  return new CreateUserController({
    createUserUseCase,
    validator: zodValidator,
  });
}