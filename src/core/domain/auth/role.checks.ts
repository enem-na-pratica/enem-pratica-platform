import type { Role } from "./role.type";
import { ROLE_LEVELS } from "./role.levels";
import { ROLES } from "./roles.constants";

/** Checks if the user role is EXACTLY the expected role */
export function hasExactRole({
  userRole,
  expectedRole,
}: {
  userRole: Role;
  expectedRole: Role;
}): boolean {
  return userRole === expectedRole;
}

/** Checks if the user role level is GREATER OR EQUAL (>=) than the required role */
export function hasAtLeastRole({
  userRole,
  requiredRole,
}: {
  userRole: Role;
  requiredRole: Role;
}): boolean {
  return ROLE_LEVELS[userRole] >= ROLE_LEVELS[requiredRole];
}

/** Checks if the user role level is STRICTLY GREATER (>) than the target role */
export function hasHigherRole({
  userRole,
  targetRole,
}: {
  userRole: Role;
  targetRole: Role;
}): boolean {
  return ROLE_LEVELS[userRole] > ROLE_LEVELS[targetRole];
}

/** Checks if the user role level is LESS OR EQUAL (<=) than the limit role */
export function hasAtMostRole({
  userRole,
  limitRole,
}: {
  userRole: Role;
  limitRole: Role;
}): boolean {
  return ROLE_LEVELS[userRole] <= ROLE_LEVELS[limitRole];
}

/** Checks if the user role level is STRICTLY LESS (<) than the target role */
export function hasLowerRole({
  userRole,
  targetRole,
}: {
  userRole: Role;
  targetRole: Role;
}): boolean {
  return ROLE_LEVELS[userRole] < ROLE_LEVELS[targetRole];
}

/** Type Guard to validate if a value is a valid Role */
export function isRole(role: unknown): role is Role {
  return typeof role === "string" && role in ROLES;
}
