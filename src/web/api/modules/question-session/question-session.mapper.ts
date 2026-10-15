import {
  QuestionSessionDto,
  QuestionSessionExtendedDto,
  QuestionSessionStatsDto,
} from './question-session.dto';
import {
  QuestionSession,
  QuestionSessionExtended,
  QuestionSessionStats,
} from './question-session.model';

export const QuestionSessionMapper = {
  toModel(dto: QuestionSessionDto): QuestionSession {
    return {
      ...dto,
      date: dto.date,
      nextReviewDate: dto.nextReviewDate ? dto.nextReviewDate : null,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    };
  },

  toExtendedModel(
    dto: QuestionSessionExtendedDto,
  ): QuestionSessionExtended {
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

  toStats(dto: QuestionSessionStatsDto): QuestionSessionStats {
    return {
      ...dto,
      weeklyProgress: {
        ...dto.weeklyProgress,
      },
    };
  },
};
