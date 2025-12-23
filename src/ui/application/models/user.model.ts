import { Role } from "@/src/core/domain/auth/roles";

export type UserModel = {
  id: string;
  name: string;
  username: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}