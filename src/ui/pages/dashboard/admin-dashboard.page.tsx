"use client";

import { useEffect, useState } from "react";
import { UserModel } from "@/src/ui/application/models";
import { LogoutButton } from "@/src/ui/components/logout-button";
import { ThemeToggle } from "@/src/ui/components/theme-toggle";
import { SidebarItem } from "@/src/ui/components/sidebar-item";
import { UsersView } from "@/src/ui/components/users-view";
import { HomeView } from "@/src/ui/components/home-view";

type Tab = "home" | "users" | "settings";

const MENU_ITEMS: { id: Tab; label: string; icon: string }[] = [
  { id: "home", label: "Início", icon: "🏠" },
  { id: "users", label: "Usuários", icon: "👥" },
  { id: "settings", label: "Configurações", icon: "⚙️" },
];

export function AdminDashboard({ user }: { user: UserModel }) {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  const [users, setUsers] = useState<UserModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/users");

        if (!response.ok) {
          throw new Error("Falha ao carregar usuários");
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const renderView = () => {
    const views: Record<Tab, React.ReactNode> = {
      home: <HomeView />,
      users: <UsersView users={users} />,
      settings: <UnderConstruction title="configurações" />,
    };

    return views[activeTab] || <UnderConstruction title={activeTab} />;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-(--background) text-(--foreground) transition-colors duration-500">
      {/* sidebar */}
      <aside className="w-64 bg-(--card-background) border-r border-(--foreground)/10 hidden md:flex flex-col">
        <div className="p-6 border-b border-(--foreground)/10">
          <h1 className="text-xl font-bold tracking-tight text-(--accent)">
            ENEM <span className="text-(--foreground)">na Prática</span>
          </h1>
          <p className="text-[10px] opacity-50 uppercase tracking-widest mt-1">
            Painel de Administração
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {MENU_ITEMS.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-(--foreground)/10">
          <LogoutButton />
        </div>
      </aside>

      {/* main content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-(--foreground)/10 flex items-center justify-between px-8 bg-(--card-background)/30 backdrop-blur-sm shrink-0">
          <h2 className="font-semibold capitalize text-(--accent)">
            {MENU_ITEMS.find((item) => item.id === activeTab)!.label}
          </h2>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium">Olá, {user.name}</span>
              <span className="text-[10px] opacity-50 font-bold uppercase tracking-tighter">
                Administrador
              </span>
            </div>
          </div>
        </header>

        <section className="flex-1 p-8 overflow-y-auto">{renderView()}</section>
      </main>
    </div>
  );
}

function UnderConstruction({ title }: { title: string }) {
  return (
    <div className="card flex flex-col items-center justify-center h-64 border-2 border-dashed border-(--foreground)/10 bg-transparent text-(--foreground)/40">
      <span className="text-4xl mb-2">🚧</span>
      <p>Tela de {title} em construção...</p>
    </div>
  );
}
