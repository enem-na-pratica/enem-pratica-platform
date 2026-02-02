import Link from "next/link";
import { UserCard as StudentCard, Header, Footer } from "@/src/web/components";
import { User } from "@/src/web/api";
import { COURSE_NAVIGATION_ITEMS } from "@/src/web/config";
import { makeUserService } from "@/src/web/api";

export async function TeacherDashboard({ user }: { user: User }) {
  const students = await makeUserService().listStudentsByInstructor("me");

  return (
    <>
      <Header />
      <main className="w-full max-w-6xl mx-auto py-8 space-y-8 px-4">
        {/* Teacher's Panel */}
        <section className="space-y-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-black tracking-tight">
              Dashboard Docente
            </h2>
            <p className="text-lg opacity-60">
              Seus materiais e ferramentas de gestão pessoal.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {COURSE_NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={`/dashboard/${item.key}`}
                className="card card-interactive p-6 flex flex-col items-center justify-center gap-4 border-2 border-transparent hover:border-(--accent) group"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className="text-sm font-bold uppercase tracking-widest text-center">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <hr className="border-(--card-background) opacity-30" />

        {/* Student Management */}
        <section className="space-y-8">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h2 className="text-3xl font-black tracking-tight">
                Gestão de Alunos
              </h2>
              <p className="opacity-60 text-lg">
                Acompanhe o desempenho individual de cada estudante.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-(--card-background) px-4 py-2 rounded-lg border border-(--foreground)/10">
              <span className="text-sm font-bold opacity-60 uppercase">
                Total:
              </span>
              <span className="text-2xl font-black text-(--accent)">
                {students.length}
              </span>
            </div>
          </div>

          {students.length === 0 ? (
            <div className="card w-full max-w-none text-center py-20 opacity-50 border-2 border-dashed border-(--foreground)/20 bg-transparent">
              <p className="text-xl italic">
                Nenhum aluno vinculado à sua conta ainda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
                <StudentCard key={student.id} user={student} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer user={user} />
    </>
  );
}
