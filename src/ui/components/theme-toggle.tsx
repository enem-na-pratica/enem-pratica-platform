"use client";

import { useTheme } from "@/src/ui/hooks/use-theme";

const SunIcon = () => <span className="text-xl">☀️</span>;
const MoonIcon = () => <span className="text-xl">🌙</span>;

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Mudar para modo ${theme === "light" ? "escuro" : "claro"}`}
      className="fixed top-4 right-4 p-2 rounded-full shadow-lg transition-colors duration-500"
      style={{
        backgroundColor:
          theme === "light"
            ? "var(--card-background)"
            : "var(--card-background)",
        color: "var(--foreground)",
      }}
    >
      {theme === "light" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
