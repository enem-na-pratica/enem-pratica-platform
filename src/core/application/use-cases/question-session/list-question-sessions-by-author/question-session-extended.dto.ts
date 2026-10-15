import type {
  QuestionSessionDto,
  SubjectDto,
  TopicDto,
} from '@/src/core/application/common/dtos';

export type QuestionSessionExtendedDto = DeepPrettify<
  QuestionSessionDto & {
    topic: TopicDto & {
      subject: SubjectDto;
    };
  }
>;
