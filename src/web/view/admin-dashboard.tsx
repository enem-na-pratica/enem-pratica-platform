import {
  Sidebar,
  ThemeToggle,
  QuickActions,
  UnderConstruction,
  UsersManager,
} from "@/src/web/components";
import { User } from "@/src/web/api";
import { ADMIN_NAVIGATION_ITEMS, AdminNavigationKey } from "@/src/web/config";

type AdminDashboardProps = {
  user: User;
  params: Record<string, string | string[] | undefined>;
};

function isAdminNavigationKey(value: string): value is AdminNavigationKey {
  return ADMIN_NAVIGATION_ITEMS.some((item) => item.key === value);
}

function normalizeAdminNavigationKey(
  value: string | string[] | undefined,
): AdminNavigationKey {
  if (!value) return "home";

  const candidateKey = Array.isArray(value) ? value[0] : value;

  if (isAdminNavigationKey(candidateKey)) return candidateKey;

  return "home";
}

export async function AdminDashboard({ user, params }: AdminDashboardProps) {
  const activeTab = normalizeAdminNavigationKey(params.tab);

  const renderView = async () => {
    switch (activeTab) {
      case "users":
        return <UsersManager />;
      case "settings":
        return <UnderConstruction title="configurações" />;
      default:
        return <QuickActions />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-(--background) text-(--foreground) transition-colors duration-500">
      <Sidebar activeTab="home" navigation_items={ADMIN_NAVIGATION_ITEMS} />

      {/* main content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-(--foreground)/10 flex items-center justify-between px-8 bg-(--card-background)/30 backdrop-blur-sm shrink-0">
          <h2 className="font-semibold capitalize text-(--accent)">
            {
              ADMIN_NAVIGATION_ITEMS.find((item) => item.key === activeTab)!
                .label
            }
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

        <section className="flex-1 p-8 overflow-y-auto">
          {await renderView()}
        </section>
      </main>
    </div>
  );
}
