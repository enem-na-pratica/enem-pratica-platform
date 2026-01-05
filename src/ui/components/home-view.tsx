import Link from "next/link";
import { USER_ACTIONS, UserActionType } from "@/src/ui/constants";

export function HomeView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold">Visão Geral</h1>

      {/* Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {USER_ACTIONS.map((item: UserActionType) => (
          <Link
            key={item.slug}
            href={`/dashboard/${item.slug}`}
            className="card card-interactive flex flex-col items-center justify-center p-8 gap-4 border-2 border-transparent hover:border-(--accent) group bg-(--card-background)"
          >
            <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
              {item.icon}
            </span>
            <span className="text-sm font-black uppercase tracking-widest text-center group-hover:text-(--accent) transition-colors">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
