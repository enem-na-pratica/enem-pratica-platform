import { LogoutController } from "@/src/core/presentation/controllers/auth/logout.controller";

export function makeLogoutController() {
  return new LogoutController();
}