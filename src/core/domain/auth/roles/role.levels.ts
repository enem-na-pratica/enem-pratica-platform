import { Role } from "./role.type";
import { ROLES } from "./roles.constants";

export const ROLE_LEVELS: Record<Role, number> = {
  [ROLES.STUDENT]: 1,
  [ROLES.TEACHER]: 2,
  [ROLES.ADMIN]: 3,
  [ROLES.SUPERADMIN]: 4,
};
