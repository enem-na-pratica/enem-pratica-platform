import { UserTopicProgressEntityMapper } from '@/src/core/infrastructure/databases/prisma/mappers';

export function makeUserTopicProgressEntityMapper() {
  return new UserTopicProgressEntityMapper();
}
