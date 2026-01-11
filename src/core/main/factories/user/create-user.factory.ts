import { UserResDtoMapper } from '@/src/core/application/mapper/user-dto.mapper';
import { CreateUserUseCase } from '@/src/core/application/use-cases/user/create-user.use-case';
import { BcryptAdapter } from '@/src/core/infrastructure/criptography/bcrypt.adapter';
import { makePrismaUserCommand } from '@/src/core/main/factories/commands';
import { makeUserPrismaRepository } from '@/src/core/main/factories/repositories';
import { CreateUserController } from '@/src/core/presentation/controllers/user/create-user.controller';
import { ZodValidation } from '@/src/core/infrastructure/validation/zod/zod-validation';
import { createUserSchema } from '@/src/core/infrastructure/validation/zod/schemas';

const SALT = 12;

export function makeCreateUserController() {
  const userRepository = makeUserPrismaRepository();
  const userCommand = makePrismaUserCommand();
  const userResDtoMapper = new UserResDtoMapper();
  const bcryptAdapter = new BcryptAdapter(SALT);

  const createUserUseCase = new CreateUserUseCase({
    hasher: bcryptAdapter,
    mapper: userResDtoMapper,
    userCommand: userCommand,
    userRepository: userRepository,
  });

  const createUserValidator = new ZodValidation(createUserSchema);

  return new CreateUserController({
    createUserUseCase,
    createUserValidator
  });
}
