import type { Mapper } from "@/src/core/domain/contracts/mappers";
import type { UserDto } from "@/src/core/application/common/dtos";
import type { PrismaUserPublic } from "@/src/core/infrastructure/databases/prisma/selects";

export class PrismaUserDtoMapper implements Mapper<PrismaUserPublic, UserDto> {
  public map(user: PrismaUserPublic): UserDto {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
