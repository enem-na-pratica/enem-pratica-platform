import type { Role } from '@/src/web/config';

import type { InstructorWithStudentCountDto, UserDto } from './user.dto';
import type { InstructorWithStudentCount, User } from './user.model';

export const UserMapper = {
  toModel(dto: UserDto): User {
    return {
      id: dto.id,
      name: dto.name,
      username: dto.username,
      role: dto.role as Role,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    };
  },

  toInstructorModel(
    dto: InstructorWithStudentCountDto,
  ): InstructorWithStudentCount {
    return {
      instructor: UserMapper.toModel(dto.instructor),
      studentsCount: dto.studentsCount,
    };
  },
};
