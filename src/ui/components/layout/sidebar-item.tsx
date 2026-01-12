export function SidebarItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
        active
          ? "bg-(--accent) text-(--foreground) font-bold shadow-lg"
          : "text-(--foreground) opacity-60 hover:opacity-100 hover:bg-(--foreground)/5"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm">{label}</span>
    </button>
  );
}
