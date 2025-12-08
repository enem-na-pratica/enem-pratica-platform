import { Controller } from '@/src/core/presentation/interfaces';
import { LoginController } from '@/src/core/presentation/controllers/auth/login.controller';
import { LoginUseCase } from '@/src/core/application/use-cases/auth/login.use-case';
import { UserRepositoryLocal } from '@/src/core/infrastructure/repositories/local/user.repository';

export function makeLoginController(): Controller {
  const userRepository = new UserRepositoryLocal()
  const loginUseCase = new LoginUseCase(userRepository)
  return new LoginController(loginUseCase)
}