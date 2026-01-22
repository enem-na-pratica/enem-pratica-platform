import type { Query } from "@/src/core/application/common/interfaces";
import type {
  InstructorWithStudentCountDto
} from "./instructor-with-student-count.dto";

export type GetInstructorsLoadQuery = Query<
  void,
  InstructorWithStudentCountDto[]
>
