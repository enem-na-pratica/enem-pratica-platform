import type { UseCase } from '@/src/core/application/common/interfaces';
import type {
  InstructorWithStudentCountDto
} from "./instructor-with-student-count.dto";
import type { ListInstructorsLoadQuery } from "./list-instructors-load.query";

export type ListAvailableInstructorsUseCaseDeps = {
  listInstructorsLoad: ListInstructorsLoadQuery;
}

export class ListAvailableInstructorsUseCase
  implements UseCase<void, InstructorWithStudentCountDto[]> {
  private readonly listInstructorsLoad: ListInstructorsLoadQuery;

  constructor({ listInstructorsLoad }: ListAvailableInstructorsUseCaseDeps) {
    this.listInstructorsLoad = listInstructorsLoad;
  }

  async execute(): Promise<InstructorWithStudentCountDto[]> {
    return await this.listInstructorsLoad.execute();
  }
}
