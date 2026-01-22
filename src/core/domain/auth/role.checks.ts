import type { Role } from "./role.type";
import { ROLE_LEVELS } from "./role.levels";
import { ROLES } from "./roles.constants";

/** Checks if the level is EXACTLY equal */
export function hasExactRole(userRole: Role, expectedRole: Role): boolean {
  return userRole === expectedRole;
}

/** Checks if the level is GREATER OR EQUAL (>=) */
export function hasAtLeastRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_LEVELS[userRole] >= ROLE_LEVELS[requiredRole];
}

/** Checks if the level is STRICTLY GREATER (>) */
export function hasHigherRole(userRole: Role, targetRole: Role): boolean {
  return ROLE_LEVELS[userRole] > ROLE_LEVELS[targetRole];
}

/** Checks if the level is LESS OR EQUAL (<=) */
export function hasAtMostRole(userRole: Role, limitRole: Role): boolean {
  return ROLE_LEVELS[userRole] <= ROLE_LEVELS[limitRole];
}

/** Checks if the level is STRICTLY LESS (<) */
export function hasLowerRole(userRole: Role, targetRole: Role): boolean {
  return ROLE_LEVELS[userRole] < ROLE_LEVELS[targetRole];
}

/** Type Guard to validate if a string is a valid Role */
export function isRole(role: unknown): role is Role {
  return typeof role === "string" && role in ROLES;
}
