import type {
  QuestionSessionDto,
  SubjectDto,
  TopicDto,
} from '@/src/core/application/common/dtos';

export type QuestionSessionWithTopicAndSubjectDto = DeepPrettify<
  QuestionSessionDto & {
    topic: TopicDto & {
      subject: SubjectDto;
    };
  }
>;

export type QuestionSessionStatisticsDto = {
  totalCount: number;
  globalAverage: number;
};

export type UserQuestionSessionsOverviewDto = {
  statistics: QuestionSessionStatisticsDto;
  questionSessions: QuestionSessionWithTopicAndSubjectDto[];
};
