'use client';

import { useState } from 'react';

import { useNotify } from '@/src/web/hooks';

import { setIsReviewedAction } from '../actions';

type UseSessionReviewToggleParams = {
  questionSessionId: string;
  initialIsReviewed: boolean;
};

export function useSessionReviewToggle({
  questionSessionId,
  initialIsReviewed,
}: UseSessionReviewToggleParams) {
  const [isReviewed, setIsReviewed] = useState(initialIsReviewed);
  const [isUpdating, setIsUpdating] = useState(false);
  const { notify } = useNotify();

  const handleToggleReview = async () => {
    if (isUpdating) return;

    const nextIsReviewed = !isReviewed;
    setIsReviewed(nextIsReviewed);
    setIsUpdating(true);

    try {
      await setIsReviewedAction({
        questionSessionId,
        isReviewed: nextIsReviewed,
      });
      notify({
        message: nextIsReviewed
          ? 'Sessão marcada como revisada.'
          : 'Marcação de revisão removida.',
        type: 'success',
      });
    } catch {
      setIsReviewed(!nextIsReviewed);
      notify({
        message: 'Erro ao atualizar. Tente novamente.',
        type: 'error',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return { isReviewed, isUpdating, handleToggleReview };
}
