import type { Role } from "@/src/core/domain/auth";

export type TokenPayload = {
  id: string;
  username: string;
  role: Role;
};