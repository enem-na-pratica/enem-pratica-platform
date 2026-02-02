import type { UseCase } from '@/src/core/application/common/interfaces';
import type { UserDto } from "@/src/core/application/common/dtos";
import type {
  ListStudentsByInstructorQuery
} from './list-students-by-instructor.query';

export type ListStudentsByInstructorDeps = {
  listStudentsByInstructor: ListStudentsByInstructorQuery;
}

export class ListStudentsByInstructorUsecase implements UseCase<string, UserDto[]> {
  private readonly listStudentsByInstructor: ListStudentsByInstructorQuery;

  constructor({ listStudentsByInstructor }: ListStudentsByInstructorDeps) {
    this.listStudentsByInstructor = listStudentsByInstructor
  }

  async execute(instructorUsername: string): Promise<UserDto[]> {
    return await this.listStudentsByInstructor.execute(instructorUsername);
  }
}