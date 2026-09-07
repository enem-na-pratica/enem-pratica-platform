import { useContext } from 'react';

import { ToggleContext } from '../mock-exam-toggle.provider';

export function useMockExamToggle() {
  const ctx = useContext(ToggleContext);
  if (!ctx) {
    throw new Error(
      'useMockExamToggle must be used within MockExamToggleProvider',
    );
  }
  return ctx;
}
