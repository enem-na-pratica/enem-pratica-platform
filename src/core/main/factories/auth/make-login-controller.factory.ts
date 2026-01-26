import { LoginController } from "@/src/core/presentation/controllers/auth";
import { LoginUseCase } from "@/src/core/application/use-cases/auth";
import { makePrismaUserRepository } from "@/src/core/main/factories/common/repositories";
import { BcryptAdapter } from "@/src/core/infrastructure/crypto";
import { ZodValidator, loginSchema } from "@/src/core/infrastructure/validation/zod";
import { makeJwtAdapter } from "@/src/core/main/factories/common/auth";

export function makeLoginController() {
  const bcryptAdapter = new BcryptAdapter();
  const loginUseCase = new LoginUseCase({
    userRepository: makePrismaUserRepository(),
    tokenGenerator: makeJwtAdapter(),
    hashComparer: bcryptAdapter
  });

  const zodValidator = new ZodValidator(loginSchema);

  return new LoginController({
    loginUseCase,
    validator: zodValidator
  });
}