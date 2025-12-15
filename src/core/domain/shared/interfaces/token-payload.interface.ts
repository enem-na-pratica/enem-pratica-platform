import { Role } from "@/src/core/domain/auth/roles";

export type TokenPayload = {
  id: string;
  username: string;
  role: Role;
};