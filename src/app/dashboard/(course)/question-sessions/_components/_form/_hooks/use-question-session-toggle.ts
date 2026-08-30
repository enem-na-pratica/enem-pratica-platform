import { useContext } from 'react';

import { ToggleContext } from '../question-session-toggle.provider';

export function useQuestionSessionToggle() {
  const ctx = useContext(ToggleContext);
  if (!ctx) {
    throw new Error(
      'useQuestionSessionToggle must be used within QuestionSessionToggleProvider',
    );
  }
  return ctx;
}
