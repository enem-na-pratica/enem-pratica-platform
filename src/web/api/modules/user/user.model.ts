import type { Role } from '@/src/web/config'

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