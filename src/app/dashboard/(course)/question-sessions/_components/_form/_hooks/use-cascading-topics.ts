import { type ChangeEvent, useState } from 'react';

import type { Topic } from '@/src/web/api';
import { useNotify } from '@/src/web/hooks';

import { fetchTopicsBySubject } from '../../../api';

type UseCascadingTopicsParams = {
  targetUsername?: string;
  onSubjectReset: (topicId: string) => void;
};

export function useCascadingTopics({
  targetUsername,
  onSubjectReset,
}: UseCascadingTopicsParams) {
  const [selectedSubjectSlug, setSelectedSubjectSlug] = useState('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const { notify } = useNotify();

  const handleSubjectChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    const slug = event.target.value;
    setSelectedSubjectSlug(slug);
    setTopics([]);
    onSubjectReset('');

    if (!slug) return;

    setIsLoadingTopics(true);
    try {
      const data = await fetchTopicsBySubject({
        subjectSlug: slug,
        targetUsername,
      });
      // TODO: Refactor fetchTopicsBySubject to a dedicated endpoint that returns only the lightweight topic shape, eliminating unnecessary TopicProgress overhead.
      setTopics(data.map((tp) => tp.topic));
    } catch {
      notify({ message: 'Erro ao carregar assuntos.', type: 'error' });
    } finally {
      setIsLoadingTopics(false);
    }
  };

  const resetTopics = () => {
    setSelectedSubjectSlug('');
    setTopics([]);
  };

  return {
    selectedSubjectSlug,
    topics,
    isLoadingTopics,
    handleSubjectChange,
    resetTopics,
  };
}
