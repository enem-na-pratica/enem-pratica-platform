import { NewUserForm } from "./_components/new-user-form";
import { ROLES } from "@/src/ui/constants";
import { UserModel } from "@/src/ui/application/models";
import Link from "next/link";
import { headers } from "next/headers";
import { getRoleFromHeaders } from "@/src/ui/helpers";

const teachersMock: UserModel[] = [
  {
    id: "teacher-1",
    name: "João Silva",
    username: "joao.silva",
    role: ROLES.TEACHER,
    createdAt: new Date("2024-01-10T10:00:00Z"),
    updatedAt: new Date("2024-01-10T10:00:00Z"),
  },
  {
    id: "teacher-2",
    name: "Maria Oliveira",
    username: "maria.oliveira",
    role: ROLES.TEACHER,
    createdAt: new Date("2024-02-05T14:30:00Z"),
    updatedAt: new Date("2024-02-05T14:30:00Z"),
  },
  {
    id: "teacher-3",
    name: "Carlos Pereira",
    username: "carlos.pereira",
    role: ROLES.TEACHER,
    createdAt: new Date("2024-03-12T09:15:00Z"),
    updatedAt: new Date("2024-03-12T09:15:00Z"),
  },
];

type UserCreatorRole = typeof ROLES.ADMIN | typeof ROLES.SUPERADMIN;

export default async function NewUserPage() {
  const headersList = await headers();
  const role = getRoleFromHeaders(headersList) as UserCreatorRole;

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

        <NewUserForm teachers={teachersMock} currentUserRole={role} />
      </div>
    </div>
  );
}
