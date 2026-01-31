import { UserEntityMapper } from '@/src/core/infrastructure/databases/prisma/mappers'

export function makeUserEntityMapper() {
  return new UserEntityMapper();
}