import {
  QuestionSessionDto,
  QuestionSessionWithTopicAndSubjectDto,
  UserQuestionSessionsOverviewDto,
} from './question-session.dto';
import {
  QuestionSession,
  QuestionSessionWithTopicAndSubject,
  UserQuestionSessionsOverview,
} from './question-session.model';

export const QuestionSessionMapper = {
  toModel(dto: QuestionSessionDto): QuestionSession {
    return {
      ...dto,
      date: new Date(dto.date),
      nextReviewDate: dto.nextReviewDate ? new Date(dto.nextReviewDate) : null,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    };
  },

  mapQuestionSessionDtoToModel(
    dto: QuestionSessionWithTopicAndSubjectDto,
  ): QuestionSessionWithTopicAndSubject {
    return {
      ...QuestionSessionMapper.toModel(dto),
      topic: {
        ...dto.topic,
        createdAt: new Date(dto.createdAt),
        subject: {
          ...dto.topic.subject,
          createdAt: new Date(dto.topic.subject.createdAt),
        },
      },
    };
  },

  toOverviewModel(
    dto: UserQuestionSessionsOverviewDto,
  ): UserQuestionSessionsOverview {
    return {
      ...dto,
      questionSessions: dto.questionSessions.map((s) =>
        this.mapQuestionSessionDtoToModel(s),
      ),
    };
  },
};
