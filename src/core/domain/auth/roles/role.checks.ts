import { Role } from "./role.type";
import { ROLE_LEVELS } from "./role.levels";

// >= nível requerido
export function hasAtLeastRole(
  requiredRole: Role,
  userRole: Role
): boolean {
  return ROLE_LEVELS[userRole] >= ROLE_LEVELS[requiredRole];
}

// === nível exato
export function hasExactRole(
  expectedRole: Role,
  userRole: Role
): boolean {
  return userRole === expectedRole;
}
