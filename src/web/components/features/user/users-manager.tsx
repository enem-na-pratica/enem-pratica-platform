import Link from "next/link";
import { makeUserService } from "@/src/web/api";

export async function UsersManager() {
  const users = await makeUserService().list();
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Usuários</h1>
        </div>

        <Link
          className="button-primary flex items-center gap-2"
          href="/users/new"
        >
          <span>➕</span> Novo Usuário
        </Link>
      </div>

      <div className="bg-(--card-background) rounded-xl shadow-sm overflow-hidden border border-(--foreground)/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-(--foreground)/5 text-(--accent) text-xs uppercase tracking-wider">
              <th className="p-4 font-bold">Nome</th>
              <th className="p-4 font-bold">Username</th>
              <th className="p-4 font-bold">Role</th>
              <th className="p-4 font-bold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--foreground)/5">
            {users.map((u) => (
              <tr
                key={u.id}
                className="hover:bg-(--foreground)/5 transition-colors group"
              >
                <td className="p-4 text-sm font-medium">{u.name}</td>
                <td className="p-4 text-sm opacity-70">{u.username}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-(--accent) text-(--foreground)">
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-right space-x-3">
                  <button
                    className="opacity-50 hover:opacity-100 hover:text-(--accent) transition-all"
                    title="Editar Usuário"
                  >
                    ✏️
                  </button>
                  <button
                    className="opacity-50 hover:opacity-100 hover:text-(--error) transition-all"
                    title="Excluir Usuário"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
