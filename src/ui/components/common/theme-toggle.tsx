"use client";

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

const SunIcon = () => <span className="text-xl">☀️</span>;
const MoonIcon = () => <span className="text-xl">🌙</span>;

function ThemeToggleComponent() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const isDark = theme === "dark" || resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
      className="p-2 rounded-lg transition-all duration-300 cursor-pointer hover:bg-(--foreground)/10 flex items-center justify-center"
      title={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

export const ThemeToggle = dynamic(
  () => Promise.resolve(ThemeToggleComponent),
  {
    ssr: false,
    loading: () => <div className="w-9 h-9 p-2" aria-hidden="true" />,
  }
);
