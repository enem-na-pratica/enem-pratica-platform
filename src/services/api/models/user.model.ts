import { Role } from "@/src/ui/constants";

export type UserModel = {
  id: string;
  name: string;
  username: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}