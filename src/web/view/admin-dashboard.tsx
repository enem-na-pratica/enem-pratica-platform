import { User, makeUserService } from '@/src/web/api';
import {
  QuickActions,
  Sidebar,
  ThemeToggle,
  UnderConstruction,
  UsersManager,
} from '@/src/web/components';
import { ADMIN_NAVIGATION_ITEMS, AdminNavigationKey } from '@/src/web/config';

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
  if (!value) return 'home';

  const candidateKey = Array.isArray(value) ? value[0] : value;

  if (isAdminNavigationKey(candidateKey)) return candidateKey;

  return 'home';
}

export async function AdminDashboard({ user, params }: AdminDashboardProps) {
  const activeTab = normalizeAdminNavigationKey(params.tab);
  const users = await makeUserService().list();

  const renderView = async () => {
    switch (activeTab) {
      case 'users':
        return <UsersManager users={users} />;
      case 'settings':
        return <UnderConstruction title="configurações" />;
      default:
        return <QuickActions />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-(--background) text-(--foreground) transition-colors duration-500">
      <Sidebar
        activeTab={activeTab}
        navigation_items={ADMIN_NAVIGATION_ITEMS}
      />

      {/* main content */}
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-(--foreground)/10 bg-(--card-background)/30 px-8 backdrop-blur-sm">
          <h2 className="font-semibold text-(--accent) capitalize">
            {
              ADMIN_NAVIGATION_ITEMS.find((item) => item.key === activeTab)!
                .label
            }
          </h2>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium">Olá, {user.name}</span>
              <span className="text-[10px] font-bold tracking-tighter uppercase opacity-50">
                Administrador
              </span>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8">
          {await renderView()}
        </section>
      </main>
    </div>
  );
}
