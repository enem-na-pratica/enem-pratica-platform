import type { Query } from "@/src/core/application/common/interfaces";
import type { MockExamDto } from "@/src/core/application/common/dtos";

export type ListMockExamsByAuthorQuery = Query<string, MockExamDto[]>;
