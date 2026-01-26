import { LogoutController } from "@/src/core/presentation/controllers/auth";

export function makeLogout() {
  return new LogoutController();
}