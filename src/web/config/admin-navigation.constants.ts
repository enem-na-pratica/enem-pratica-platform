export const ADMIN_NAVIGATION_ITEMS = [
  { key: "home", label: "Início", icon: "🏠" },
  { key: "users", label: "Usuários", icon: "👥" },
  { key: "settings", label: "Configurações", icon: "⚙️" },
] as const;

export type AdminNavigationItem = (typeof ADMIN_NAVIGATION_ITEMS)[number];
export type AdminNavigationKey = AdminNavigationItem["key"];