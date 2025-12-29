"use client";

import { useTheme } from "@/src/ui/hooks/use-theme";

const SunIcon = () => <span className="text-xl">☀️</span>;
const MoonIcon = () => <span className="text-xl">🌙</span>;

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Mudar para modo ${theme === "light" ? "escuro" : "claro"}`}
      className="p-2 rounded-lg transition-all duration-300 cursor-pointer hover:bg-(--foreground)/10 flex items-center justify-center"
    >
      {theme === "light" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
