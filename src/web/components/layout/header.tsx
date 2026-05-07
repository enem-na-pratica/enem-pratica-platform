'use client';

import { ReactNode, useEffect, useState } from 'react';

import { LogoutButton, ThemeToggle } from '@/src/web/components';

type HeaderProps = {
  children?: ReactNode;
};

export function Header({ children }: HeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-(--foreground)/10 bg-(--card-background)/80 shadow-sm backdrop-blur-sm transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'} `}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        {children ?? (
          <h1 className="text-xl font-bold tracking-tight text-(--accent)">
            ENEM <span className="text-(--foreground)">na Prática</span>
          </h1>
        )}

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="hidden h-6 w-px bg-(--foreground)/10 sm:block" />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
