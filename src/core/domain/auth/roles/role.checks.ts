import { Role } from "./role.type";
import { ROLE_LEVELS } from "./role.levels";
import { ROLES } from "./roles.constants";

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

export function isRole(role: unknown): role is Role {
  return typeof role === "string" && role in ROLES;
}