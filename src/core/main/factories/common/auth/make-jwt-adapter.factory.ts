import { JwtAdapter } from "@/src/core/infrastructure/auth";
import env from "@/src/core/main/config/env";

export function makeJwtAdapter() {
  return new JwtAdapter({ secret: env.jwtSecret, expiresIn: '7D' });
}