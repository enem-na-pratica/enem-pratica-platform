import { useContext } from 'react';

import { EssayToggleContext } from '../essay-toggle.provider';

export function useEssayToggle() {
  const ctx = useContext(EssayToggleContext);
  if (!ctx) {
    throw new Error('useEssayToggle must be used within EssayToggleProvider');
  }
  return ctx;
}
