import { Role } from "@/src/core/domain/auth";

export type Requester = {
  id: string;
  username: string;
  role: Role;
};