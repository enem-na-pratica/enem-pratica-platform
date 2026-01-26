import { CreateUserController } from '@/src/core/presentation/controllers/user';
import { CreateUserUseCase } from '@/src/core/application/use-cases/user';
import { makePrismaUserRepository } from '@/src/core/main/factories/common/repositories';
import {
  ZodValidator,
  createUserSchema
} from '@/src/core/infrastructure/validation/zod';
import { makeBcryptAdapter } from "@/src/core/main/factories/common/crypto";
import { makeUserDtoMapper } from "@/src/core/main/factories/common/mappers/entity-to-dto";

export function makeCreateUserController() {
  const createUserUseCase = new CreateUserUseCase({
    hasher: makeBcryptAdapter(),
    mapper: makeUserDtoMapper(),
    userRepository: makePrismaUserRepository(),
  });

  const zodValidator = new ZodValidator(createUserSchema);

  return new CreateUserController({
    createUserUseCase,
    validator: zodValidator,
  });
}