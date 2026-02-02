import type { Query } from "@/src/core/application/common/interfaces";
import type { UserDto } from "@/src/core/application/common/dtos";

export type ListStudentsByInstructorQuery = Query<string, UserDto[]>;