import { LoginController } from "@/src/core/presentation/controllers/auth";
import { LoginUseCase } from "@/src/core/application/use-cases/auth";
import { makePrismaUserRepository } from "@/src/core/main/factories/common/repositories";
import { ZodValidator, loginSchema } from "@/src/core/infrastructure/validation/zod";
import { makeJwtAdapter } from "@/src/core/main/factories/common/auth";
import { makeBcryptAdapter } from "@/src/core/main/factories/common/crypto";

export function makeLoginController() {
  const loginUseCase = new LoginUseCase({
    userRepository: makePrismaUserRepository(),
    tokenGenerator: makeJwtAdapter(),
    hashComparer: makeBcryptAdapter(),
  });

  const zodValidator = new ZodValidator(loginSchema);

  return new LoginController({
    loginUseCase,
    validator: zodValidator
  });
}