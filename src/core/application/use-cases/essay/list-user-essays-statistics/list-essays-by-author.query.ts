import type { Query } from "@/src/core/application/common/interfaces";
import type { EssayDto } from "@/src/core/application/common/dtos";

export type ListEssaysByAuthorQuery = Query<string, EssayDto[]>;
