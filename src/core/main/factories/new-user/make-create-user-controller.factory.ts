import { CreateUserController } from '@/src/core/presentation/controllers/user';
import { CreateUserUseCase } from '@/src/core/application/use-cases/user';
import { UserDtoMapper } from '@/src/core/application/mapper';
import { makePrismaUserRepository } from '@/src/core/main/factories/common/repositories';
import {
  ZodValidator,
  createUserSchema
} from '@/src/core/infrastructure/validation/zod';
import { makeBcryptAdapter } from "@/src/core/main/factories/common/crypto";

export function makeCreateUserController() {
  const userDtoMapper = new UserDtoMapper();
  const createUserUseCase = new CreateUserUseCase({
    hasher: makeBcryptAdapter(),
    mapper: userDtoMapper,
    userRepository: makePrismaUserRepository(),
  });

  const zodValidator = new ZodValidator(createUserSchema);

  return new CreateUserController({
    createUserUseCase,
    validator: zodValidator,
  });
}