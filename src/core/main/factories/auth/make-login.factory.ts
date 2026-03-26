import { LoginUseCase } from '@/src/core/application/use-cases/auth';
import {
  ZodValidator,
  loginSchema,
} from '@/src/core/infrastructure/validation/zod';
import { env } from '@/src/core/main/config';
import { makeJwtAdapter } from '@/src/core/main/factories/common/auth';
import { makeBcryptAdapter } from '@/src/core/main/factories/common/crypto';
import { makePrismaUserRepository } from '@/src/core/main/factories/common/repositories';
import { LoginController } from '@/src/core/presentation/controllers/auth';

export function makeLogin() {
  const loginUseCase = new LoginUseCase({
    userRepository: makePrismaUserRepository(),
    tokenGenerator: makeJwtAdapter(),
    hashComparer: makeBcryptAdapter(),
  });

  const zodValidator = new ZodValidator(loginSchema);

  return new LoginController({
    loginUseCase,
    validator: zodValidator,
    isProduction: env.isProduction,
  });
}
