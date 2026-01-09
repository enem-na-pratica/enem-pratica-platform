export type CreateUserDto = {
  name: string;
  username: string;
  password: string;
  role: string;
  teacherId?: string; // Only present if role is STUDENT
}