import type { UserTopicProgress } from '@/src/core/domain/entities';

export interface UserTopicProgressRepository {
  setProgress(userTopicProgress: UserTopicProgress): Promise<UserTopicProgress>;
}
