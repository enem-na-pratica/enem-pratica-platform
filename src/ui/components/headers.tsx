import { LogoutButton } from "@/src/ui/components/logout-button";
import { ThemeToggle } from "@/src/ui/components/theme-toggle";

export function Header() {
  return (
    <header className="w-full bg-(--card-background) shadow-sm border-b border-(--foreground)/5">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <h1 className="text-xl font-bold tracking-tight text-(--accent)">
          ENEM <span className="text-(--foreground)">na Prática</span>
        </h1>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="w-px h-6 bg-(--foreground)/10 hidden sm:block" />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
