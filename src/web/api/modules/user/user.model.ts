export const ROLES = {
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export type User = {
  id: string;
  name: string;
  username: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export type InstructorWithStudentCount = {
  instructor: User;
  studentsCount: number;
}