import { LogoutController } from "@/src/core/presentation/controllers/auth";

export function makeLogoutController() {
  return new LogoutController();
}