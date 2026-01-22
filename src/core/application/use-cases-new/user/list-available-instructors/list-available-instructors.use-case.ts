import type { UseCase } from '@/src/core/application/common/interfaces';
import type {
  InstructorWithStudentCountDto
} from "./instructor-with-student-count.dto";
import type { GetInstructorsLoadQuery } from "./get-instructors-load.query";

export type ListAvailableInstructorsUseCaseDeps = {
  getInstructorsLoad: GetInstructorsLoadQuery;
}

export class ListAvailableInstructorsUseCase
  implements UseCase<void, InstructorWithStudentCountDto[]> {
  private readonly getInstructorsLoad: GetInstructorsLoadQuery;

  constructor({ getInstructorsLoad }: ListAvailableInstructorsUseCaseDeps) {
    this.getInstructorsLoad = getInstructorsLoad;
  }

  async execute(): Promise<InstructorWithStudentCountDto[]> {
    return await this.getInstructorsLoad.execute();
  }
}
