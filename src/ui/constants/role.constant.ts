export const ROLES = {
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const ROLE_LABELS: Record<Role, string> = {
  [ROLES.STUDENT]: "Estudante",
  [ROLES.TEACHER]: "Professor",
  [ROLES.ADMIN]: "Administrador",
  [ROLES.SUPER_ADMIN]: "Super Administrador",
};