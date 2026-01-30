import { NewUserForm } from "./_components/new-user-form";
import Link from "next/link";
import { headers } from "next/headers";
import { extractUserRole, makeUserService } from "@/src/web/api";

export default async function NewUserPage() {
  const headersList = await headers();
  const role = extractUserRole(headersList);

  const ListInstructors = await makeUserService().listAvailableInstructors();

  return (
    <div className="w-full flex items-center justify-center bg-(--background) p-1.5">
      <div className="card w-full max-w-lg border border-(--foreground)/10 animate-in fade-in zoom-in duration-300 shadow-2xl">
        <header className="mb-6">
          <Link
            href={"/dashboard"}
            className="text-xs font-bold text-(--accent) uppercase tracking-widest hover:opacity-70 transition-all flex items-center gap-1"
          >
            ← Voltar para listagem
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Novo Usuário</h1>
          <p className="text-sm opacity-50">
            Configure as credenciais e o nível de acesso
          </p>
        </header>

        <NewUserForm teachingStaff={ListInstructors} currentUserRole={role} />
      </div>
    </div>
  );
}
