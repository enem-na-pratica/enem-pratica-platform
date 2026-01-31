import type { Role } from "./role.type";
import { ROLES } from "./roles.constants";

export const ROLE_LEVELS: Record<Role, number> = {
  [ROLES.STUDENT]: 1,
  [ROLES.TEACHER]: 2,
  [ROLES.ADMIN]: 3,
  [ROLES.SUPER_ADMIN]: 4,
};
