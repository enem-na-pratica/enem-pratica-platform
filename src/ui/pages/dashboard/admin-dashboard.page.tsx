"use client";

import { useState } from "react";
import { UserModel } from "@/src/ui/application/models";
import { LogoutButton } from "@/src/ui/components/logout-button";
import { ThemeToggle } from "@/src/ui/components/theme-toggle";
import { SidebarItem } from "@/src/ui/components/sidebar-item";
import { UsersView } from "@/src/ui/components/users-view";
import { HomeView } from "@/src/ui/components/home-view";

type Tab = "home" | "users" | "reports" | "settings";

const MENU_ITEMS: { id: Tab; label: string; icon: string }[] = [
  { id: "home", label: "Início", icon: "🏠" },
  { id: "users", label: "Usuários", icon: "👥" },
  { id: "settings", label: "Configurações", icon: "⚙️" },
];

export function AdminDashboard({ user }: { user: UserModel }) {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  // Mock de dados mantido
  const users: UserModel[] = [
    user,
    {
      id: "2",
      name: "João Silva",
      username: "joao.prof",
      role: "TEACHER",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      name: "Maria Aluna",
      username: "maria.aluno",
      role: "STUDENT",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return (
    <div className="flex min-h-screen bg-(--background) text-(--foreground) transition-colors duration-500">
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

        <nav className="flex-1 p-4 space-y-2">
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
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-(--foreground)/10 flex items-center justify-between px-8 bg-(--card-background)/30 backdrop-blur-sm">
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

        <section className="p-8">
          {/* TODO: Improve the logic for selecting screens. */}
          {activeTab === "home" && <HomeView />}

          {activeTab === "users" && <UsersView users={users} />}

          {activeTab !== "home" && activeTab !== "users" && (
            <div className="card flex flex-col items-center justify-center h-64 border-2 border-dashed border-(--foreground)/10 bg-transparent text-(--foreground)/40">
              <span className="text-4xl mb-2">🚧</span>
              <p>Tela de {activeTab} em construção...</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
