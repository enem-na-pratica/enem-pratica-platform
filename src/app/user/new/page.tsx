import { NewUserForm } from "./_components/new-user-form";
import { ROLES } from "@/src/ui/constants";
import Link from "next/link";
import { headers } from "next/headers";
import { getRoleFromHeaders } from "@/src/ui/helpers";
import { makeUserService } from "@/src/services/factories";

type UserCreatorRole = typeof ROLES.ADMIN | typeof ROLES.SUPER_ADMIN;

export default async function NewUserPage() {
  const headersList = await headers();
  const role = getRoleFromHeaders(headersList) as UserCreatorRole;

  const teachingStaff = await makeUserService().findTeachingStaff();

  return (
    <div className="w-full flex items-center justify-center bg-(--background) p-1.5">
      <div className="card w-full max-w-lg border border-(--foreground)/10 animate-in fade-in zoom-in duration-300 shadow-2xl">
        <header className="mb-6">
          <Link
            href={"/dashboard"}
            className="text-xs font-bold text-(--accent) uppercase tracking-widest hover:opacity-70 transition-all mb-2 flex items-center gap-1"
          >
            ← Voltar para listagem
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Novo Usuário</h1>
          <p className="text-sm opacity-50">
            Configure as credenciais e o nível de acesso
          </p>
        </header>

        <NewUserForm teachingStaff={teachingStaff} currentUserRole={role} />
      </div>
    </div>
  );
}
