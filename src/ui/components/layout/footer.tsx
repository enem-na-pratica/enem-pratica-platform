import { UserModel } from "@/src/services/api/models";

export function Footer({ user }: { user: UserModel }) {
  return (
    <footer className="w-full border-t border-(--foreground)/10 mt-auto bg-(--card-background)/30">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {" "}
        <div className="flex items-center gap-4 text-sm text-(--foreground)/60">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-(--success) animate-pulse" />
            <span>
              Logado como: <strong>{user.username}</strong>
            </span>
          </div>
          <span className="hidden sm:inline opacity-30">•</span>
          <span className="hidden sm:inline opacity-60">ID: {user.id}</span>
        </div>
      </div>
    </footer>
  );
}
