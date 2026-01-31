import Link from "next/link";
import { User } from "@/src/web/api";
import { COURSE_NAVIGATION_ITEMS } from "@/src/web/config";
import { Header, Footer } from "@/src/web/components";

export function StudentDashboard({ user }: { user: User }) {
  return (
    <>
      <Header />
      <main className="w-full max-w-6xl mx-auto py-8 space-y-8 px-4">
        {/* Welcome Header */}
        <section className="text-center md:text-left">
          <h2 className="text-3xl font-bold">Olá, {user.name}!</h2>
          <p className="opacity-80">O que vamos estudar hoje?</p>
        </section>

        {/* Main Navigation Grid */}
        <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSE_NAVIGATION_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={`/dashboard/${item.key}`}
              className="card card-interactive flex flex-col items-center text-center space-y-4 border border-transparent hover:border-(--accent)"
            >
              <span className="text-4xl">{item.icon}</span>
              <div>
                <h3 className="text-xl font-bold">{item.label}</h3>
                <p className="text-sm opacity-70">{item.description}</p>
              </div>
            </Link>
          ))}
        </nav>
      </main>
      <Footer user={user} />
    </>
  );
}
