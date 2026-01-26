import { LoginController } from "@/src/core/presentation/controllers/auth";
import { LoginUseCase } from "@/src/core/application/use-cases/auth";
import { makePrismaUserRepository } from "@/src/core/main/factories/common/repositories";
import { JwtAdapter } from "@/src/core/infrastructure/auth";
import { BcryptAdapter } from "@/src/core/infrastructure/crypto";
import { ZodValidator, loginSchema } from "@/src/core/infrastructure/validation/zod";
import env from "@/src/core/main/config/env";

export function makeLoginController() {
  const jwtAdapter = new JwtAdapter({ secret: env.jwtSecret, expiresIn: '7D' });
  const bcryptAdapter = new BcryptAdapter();
  const loginUseCase = new LoginUseCase({
    userRepository: makePrismaUserRepository(),
    tokenGenerator: jwtAdapter,
    hashComparer: bcryptAdapter
  });

  const zodValidator = new ZodValidator(loginSchema);

  return new LoginController({
    loginUseCase,
    validator: zodValidator
  });
}