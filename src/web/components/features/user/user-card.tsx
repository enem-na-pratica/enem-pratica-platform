import Link from "next/link";
import { User } from "@/src/web/api/modules";
import { COURSE_NAVIGATION_ITEMS } from "@/src/web/config";

export function UserCard({ user }: { user: User }) {
  return (
    <div className="card w-full max-w-none p-0 flex flex-col border-2 border-transparent hover:border-(--accent)/50 transition-all duration-300 group overflow-hidden">
      {/* Card Header */}
      <div className="p-6 flex items-center gap-4 bg-(--foreground)/5">
        <div className="h-14 w-14 rounded-2xl bg-(--accent) flex items-center justify-center font-black text-xl text-(--foreground) shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform">
          {user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </div>
        <div>
          <h3 className="text-lg font-bold leading-tight">{user.name}</h3>
          <p className="text-sm opacity-50 font-mono">@{user.username}</p>
        </div>
      </div>

      {/* Grid of Student Actions */}
      <div className="p-4 grid grid-cols-3 gap-2">
        {COURSE_NAVIGATION_ITEMS.map((item) => (
          <Link
            key={item.key}
            href={`/dashboard/${item.key}/${user.username}`}
            title={item.label}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-(--background)/40 hover:bg-(--accent) hover:text-(--foreground) border border-(--foreground)/5 transition-all group/item"
          >
            <span className="text-xl mb-1 group-hover/item:scale-125 transition-transform">
              {item.icon}
            </span>
            <span className="text-[9px] font-black uppercase tracking-tighter text-center leading-none">
              {item.label}
            </span>
          </Link>
        ))}

        {/* Full Profile Button */}
        <Link
          href={`/dashboard/student/${user.username}`}
          className="col-span-3 mt-2 flex items-center justify-center gap-2 py-2 rounded-lg bg-(--foreground) text-(--background) text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
        >
          Ver Perfil Completo
        </Link>
      </div>
    </div>
  );
}
