'use client';

import { type ReactNode, createContext, useState } from 'react';

type EssayToggleContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const EssayToggleContext = createContext<EssayToggleContextValue | null>(
  null,
);

export function EssayToggleProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const value: EssayToggleContextValue = {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };

  return (
    <EssayToggleContext.Provider value={value}>
      {children}
    </EssayToggleContext.Provider>
  );
}
