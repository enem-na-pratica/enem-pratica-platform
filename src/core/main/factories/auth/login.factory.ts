import { Controller } from '@/src/core/presentation/interfaces';
import { LoginController } from '@/src/core/presentation/controllers/auth/login.controller';
import { LoginUseCase } from '@/src/core/application/use-cases/auth/login.use-case';
import { UserRepositoryLocal } from '@/src/core/infrastructure/repositories/local/user.repository';
import { ZodValidation } from '@/src/core/infrastructure/validation/zod/zod-validation';
import { loginSchema } from '@/src/core/infrastructure/validation/zod/schemas/login.schema';

export function makeLoginController(): Controller {
  const userRepository = new UserRepositoryLocal()
  const loginUseCase = new LoginUseCase(userRepository)
  const loginValidator = new ZodValidation(loginSchema)
  return new LoginController({ loginUseCase, loginValidator })
}