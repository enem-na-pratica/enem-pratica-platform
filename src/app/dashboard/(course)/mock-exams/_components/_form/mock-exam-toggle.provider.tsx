'use client';

import { type ReactNode, createContext, useState } from 'react';

type ToggleContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const ToggleContext = createContext<ToggleContextValue | null>(null);

export function MockExamToggleProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const value: ToggleContextValue = {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };

  return (
    <ToggleContext.Provider value={value}>{children}</ToggleContext.Provider>
  );
}
