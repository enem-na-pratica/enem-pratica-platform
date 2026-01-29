import { LogoutButton, SidebarItem } from "@/src/web/components";
import type { AdminNavigationKey, AdminNavigationItem } from "@/src/web/config";

type SidebarProps = {
  navigation_items: AdminNavigationItem[];
  activeTab: AdminNavigationKey;
};

export function Sidebar({ navigation_items, activeTab }: SidebarProps) {
  return (
    <aside className="w-64 bg-(--card-background) border-r border-(--foreground)/10 hidden md:flex flex-col">
      {/* Sidebar header */}
      <div className="p-6 border-b border-(--foreground)/10">
        <h1 className="text-xl font-bold tracking-tight text-(--accent)">
          ENEM <span className="text-(--foreground)">na Prática</span>
        </h1>
        <p className="text-[10px] opacity-50 uppercase tracking-widest mt-1">
          Painel de Administração
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigation_items.map((item) => (
          <SidebarItem
            key={item.key}
            icon={item.icon}
            label={item.label}
            active={activeTab === item.key}
            href={`?tab=${item.key}`}
          />
        ))}
      </nav>

      {/* Sidebar footer */}
      <div className="p-4 border-t border-(--foreground)/10">
        <LogoutButton />
      </div>
    </aside>
  );
}
