'use client';

import { useCallback, useState } from 'react';

import { notFound, redirect } from 'next/navigation';

import { ApiError } from '@/src/web/api/http/api-error';
import { TOPIC_STATUS } from '@/src/web/config';
import { useNotify } from '@/src/web/hooks';

import type { ColumnData } from '../_components/topic-list';
import { fetchTopicsBySubjectAndStatus } from '../api';

const FORBIDDEN = 403;
const NOT_FOUND = 404;

const EMPTY_COLUMN: ColumnData = { topics: [], isLoading: false };
const LOADING_COLUMN: ColumnData = { topics: [], isLoading: true };

type ReviewPracticeState = {
  selectedSubjectId: string;
  isLoadingSubject: boolean;
  hasLoaded: boolean;
  practice: ColumnData;
  review: ColumnData;
};

const INITIAL_STATE: ReviewPracticeState = {
  selectedSubjectId: '',
  isLoadingSubject: false,
  hasLoaded: false,
  practice: EMPTY_COLUMN,
  review: EMPTY_COLUMN,
};

type UseReviewPracticeParams = { targetUsername?: string };

async function loadSubjectTopics(subjectSlug: string, targetUsername?: string) {
  try {
    const [practiceData, reviewData] = await Promise.all([
      fetchTopicsBySubjectAndStatus({
        subjectSlug,
        status: [TOPIC_STATUS.PRACTICE],
        targetUsername,
      }),
      fetchTopicsBySubjectAndStatus({
        subjectSlug,
        status: [TOPIC_STATUS.REVIEW],
        targetUsername,
      }),
    ]);

    return { practiceData, reviewData };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === NOT_FOUND) notFound();
      if (error.status === FORBIDDEN) redirect('/access-denied');
    }

    throw error;
  }
}

const getLoadingState =
  (subjectSlug: string) => (curr: ReviewPracticeState) => ({
    ...curr,
    selectedSubjectId: subjectSlug,
    isLoadingSubject: true,
    hasLoaded: false,
    practice: LOADING_COLUMN,
    review: LOADING_COLUMN,
  });

export function useReviewPractice({ targetUsername }: UseReviewPracticeParams) {
  const [state, setState] = useState<ReviewPracticeState>(INITIAL_STATE);
  const { notify } = useNotify();

  const handleSubjectChange = useCallback(
    async (event: React.ChangeEvent<HTMLSelectElement>) => {
      const subjectSlug = event.target.value;
      if (!subjectSlug) return;

      setState(getLoadingState(subjectSlug));

      try {
        const { practiceData, reviewData } = await loadSubjectTopics(
          subjectSlug,
          targetUsername,
        );
        setState((curr) => ({
          ...curr,
          practice: { topics: practiceData, isLoading: false },
          review: { topics: reviewData, isLoading: false },
          hasLoaded: true,
        }));
      } catch (error) {
        setState((curr) => ({
          ...curr,
          practice: EMPTY_COLUMN,
          review: EMPTY_COLUMN,
        }));

        notify({
          type: 'error',
          message: 'Erro ao carregar os dados',
          description:
            'Não foi possível buscar os tópicos desta matéria. Tente novamente mais tarde.',
        });
        throw error;
      } finally {
        setState((curr) => ({ ...curr, isLoadingSubject: false }));
      }
    },
    [targetUsername, notify],
  );

  return { ...state, handleSubjectChange };
}
