import { LoginController } from '@/src/core/presentation/controllers/auth/login.controller';
import { LoginUseCase } from '@/src/core/application/use-cases/auth/login.use-case';
import { ZodValidation } from '@/src/core/infrastructure/validation/zod/zod-validation';
import { loginSchema } from '@/src/core/infrastructure/validation/zod/schemas/login.schema';
import { BcryptAdapter } from '@/src/core/infrastructure/criptography/bcrypt.adapter';
import { JwtTokenAdapter } from '@/src/core/infrastructure/criptography/jwt.adapter';
import { UserPrismaRepository } from '@/src/core/infrastructure/repositories/prisma/user-prisma.repository';
import { prisma } from '@/src/core/infrastructure/databases/prisma/prisma';
import { PrismaUserMapper } from '@/src/core/infrastructure/mapper/prisma-user.mapper';

export function makeLoginController() {
  const SALT = 12;
  const SECRET = process.env.JWT_SECRET || "fallback_secret";

  const userPrismaMapper = new PrismaUserMapper();
  const userRepository = new UserPrismaRepository({
    prisma,
    mapper: userPrismaMapper
  });
  const bcryptAdapter = new BcryptAdapter(SALT);
  const jwtTokenAdapter = new JwtTokenAdapter(SECRET, "7D");
  const loginUseCase = new LoginUseCase({
    hashComparer: bcryptAdapter,
    userRepository,
    tokenGenerator: jwtTokenAdapter
  });
  const loginValidator = new ZodValidation(loginSchema);
  return new LoginController({ loginUseCase, loginValidator });
}
