import { Controller } from '@/src/core/presentation/interfaces';
import { LoginController } from '@/src/core/presentation/controllers/auth/login.controller';
import { LoginUseCase } from '@/src/core/application/use-cases/auth/login.use-case';
import { UserRepositoryLocal } from '@/src/core/infrastructure/repositories/local/user.repository';
import { ZodValidation } from '@/src/core/infrastructure/validation/zod/zod-validation';
import { loginSchema } from '@/src/core/infrastructure/validation/zod/schemas/login.schema';
import { BcryptAdapter } from '@/src/core/infrastructure/criptography/bcrypt.adapter';

export function makeLoginController(): Controller {
  const salt = 12;
  const userRepository = new UserRepositoryLocal();
  const hashComparer = new BcryptAdapter(salt);
  const loginUseCase = new LoginUseCase({ hashComparer, userRepository });
  const loginValidator = new ZodValidation(loginSchema);
  return new LoginController({ loginUseCase, loginValidator });
}