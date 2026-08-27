'use client';
import { useCallback, useState } from 'react';

import type { Subject, TopicProgress } from '@/src/web/api';
import type { TopicStatus } from '@/src/web/config';
import { useNotify } from '@/src/web/hooks';

import { fetchTopicsBySubject, updateTopicStatus } from '../api';

type StudyTrackerState = {
  selectedSubjectSlug: string;
  isLoadingSubject: boolean;
  hasLoadedTopics: boolean;
  topics: TopicProgress[];
};

const INITIAL_STATE: StudyTrackerState = {
  selectedSubjectSlug: '',
  isLoadingSubject: false,
  hasLoadedTopics: false,
  topics: [],
};

function buildOptimisticProgress(
  topicId: string,
  status: TopicStatus,
  targetUsername: string = 'me',
) {
  return {
    id: `p-${topicId}`,
    authorId: targetUsername,
    topicId,
    status,
    updatedAt: new Date(),
    createdAt: new Date(),
  };
}

type SetStudyTrackerState = React.Dispatch<
  React.SetStateAction<StudyTrackerState>
>;

function useHandleSubjectChange(
  setState: SetStudyTrackerState,
  notify: ReturnType<typeof useNotify>['notify'],
  targetUsername?: string,
) {
  return useCallback(
    async (event: React.ChangeEvent<HTMLSelectElement>) => {
      const subjectSlug = event.target.value;
      if (!subjectSlug) return;
      setState((curr) => ({
        ...curr,
        selectedSubjectSlug: subjectSlug,
        isLoadingSubject: true,
        hasLoadedTopics: false,
        topics: [],
      }));
      try {
        const data = await fetchTopicsBySubject({
          subjectSlug: subjectSlug,
          targetUsername,
        });
        setState((curr) => ({ ...curr, topics: data, hasLoadedTopics: true }));
      } catch {
        notify({
          type: 'error',
          message: 'Erro ao carregar os dados',
          description:
            'Não foi possível buscar os tópicos desta matéria. Tente novamente mais tarde.',
        });
      } finally {
        setState((curr) => ({ ...curr, isLoadingSubject: false }));
      }
    },
    [notify, setState, targetUsername],
  );
}

function useHandleStatusChange(
  setState: SetStudyTrackerState,
  targetUsername?: string,
) {
  return useCallback(
    async (topicId: string, newStatus: TopicStatus) => {
      await updateTopicStatus({ topicId, status: newStatus, targetUsername });
      setState((curr) => ({
        ...curr,
        topics: curr.topics.map((tp) => {
          if (tp.topic.id !== topicId) {
            return tp;
          }

          let updatedProgress;
          if (tp.progress) {
            updatedProgress = {
              ...tp.progress,
              status: newStatus,
              updatedAt: new Date(),
            };
          } else {
            updatedProgress = buildOptimisticProgress(
              topicId,
              newStatus,
              targetUsername,
            );
          }

          return {
            ...tp,
            progress: updatedProgress,
          };
        }),
      }));
    },
    [setState, targetUsername],
  );
}

type UseStudyTrackerParams = { subjects: Subject[]; targetUsername?: string };

export function useStudyTracker({
  subjects,
  targetUsername,
}: UseStudyTrackerParams) {
  const [state, setState] = useState<StudyTrackerState>(INITIAL_STATE);
  const { notify } = useNotify();

  const handleSubjectChange = useHandleSubjectChange(
    setState,
    notify,
    targetUsername,
  );
  const handleStatusChange = useHandleStatusChange(setState, targetUsername);

  const selectedSubject = subjects.find(
    (s) => s.slug === state.selectedSubjectSlug,
  );

  return { ...state, selectedSubject, handleSubjectChange, handleStatusChange };
}
