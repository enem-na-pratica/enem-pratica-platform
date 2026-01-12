import { UserModel } from "@/src/services/api/models";
import Link from "next/link";
import { STUDENT_MENU, StudentMenuType } from "@/src/ui/constants";
import { Header } from "@/src/ui/components";

export function StudentDashboard({ user }: { user: UserModel }) {
  return (
    <>
      <Header />
      <div className="w-full max-w-5xl mx-auto py-8 space-y-8">
        {/* Welcome Header */}
        <section className="text-center md:text-left">
          <h2 className="text-3xl font-bold">Olá, {user.name}!</h2>
          <p className="opacity-80">O que vamos estudar hoje?</p>
        </section>

        {/* Main Navigation Grid */}
        <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STUDENT_MENU.map((item: StudentMenuType) => (
            <Link
              key={item.slug}
              href={`/dashboard/${item.slug}`}
              className="card card-interactive flex flex-col items-center text-center space-y-4 border border-transparent hover:border-(--accent)"
            >
              <span className="text-4xl">{item.icon}</span>
              <div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-sm opacity-70">{item.desc}</p>
              </div>
            </Link>
          ))}
        </nav>

        {/* Mini Profile Card */}
        <footer className="pt-8 border-t border-(--card-background)">
          <div className="flex items-center gap-4 text-sm opacity-60">
            <div className="h-2 w-2 rounded-full bg-(--success)" />
            <span>
              Logado como: <strong>{user.username}</strong>
            </span>
            <span>•</span>
            <span>ID: {user.id}</span>
          </div>
        </footer>
      </div>
    </>
  );
}
