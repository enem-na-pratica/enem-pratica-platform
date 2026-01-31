"use client";

import { useState, useEffect, ReactNode } from "react";
import { ThemeToggle, LogoutButton } from "@/src/web/components";

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

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  return (
    <header
      className={`
        w-full bg-(--card-background)/80 backdrop-blur-sm shadow-sm border-b
        border-(--foreground)/10 sticky top-0 z-50 transition-transform duration-300
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        {children ?? (
          <h1 className="text-xl font-bold tracking-tight text-(--accent)">
            ENEM <span className="text-(--foreground)">na Prática</span>
          </h1>
        )}

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="w-px h-6 bg-(--foreground)/10 hidden sm:block" />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
