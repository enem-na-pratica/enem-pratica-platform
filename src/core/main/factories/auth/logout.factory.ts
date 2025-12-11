import { LogoutController } from "@/src/core/presentation/controllers/auth/logout.controller";
import { Controller } from "@/src/core/presentation/interfaces";

export function makeLogoutController(): Controller {
  return new LogoutController();
}