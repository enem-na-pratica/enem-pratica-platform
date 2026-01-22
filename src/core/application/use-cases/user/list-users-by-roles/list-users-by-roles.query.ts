import type { Query } from "@/src/core/application/common/interfaces";
import type { Role } from "@/src/core/domain/auth";
import type { UserDto } from "@/src/core/application//common/dtos";

export type ListUsersByRolesQuery = Query<Role[], UserDto[]>
