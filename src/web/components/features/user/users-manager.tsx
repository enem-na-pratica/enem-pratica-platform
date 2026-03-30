/* eslint-disable max-lines-per-function */
import Link from 'next/link';

import { makeUserService } from '@/src/web/api';

export async function UsersManager() {
  const users = await makeUserService().list();
  return (
    <>
      <div className="mb-8 flex items-center justify-between">
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

      <div className="overflow-hidden rounded-xl border border-(--foreground)/5 bg-(--card-background) shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-(--foreground)/5 text-xs tracking-wider text-(--accent) uppercase">
              <th className="p-4 font-bold">Nome</th>
              <th className="p-4 font-bold">Username</th>
              <th className="p-4 font-bold">Role</th>
              <th className="p-4 text-right font-bold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--foreground)/5">
            {users.map((u) => (
              <tr
                key={u.id}
                className="group transition-colors hover:bg-(--foreground)/5"
              >
                <td className="p-4 text-sm font-medium">{u.name}</td>
                <td className="p-4 text-sm opacity-70">{u.username}</td>
                <td className="p-4">
                  <span className="rounded bg-(--accent) px-2 py-0.5 text-[10px] font-bold text-(--foreground)">
                    {u.role}
                  </span>
                </td>
                <td className="space-x-3 p-4 text-right">
                  <button
                    // className="transition-all hover:text-(--accent)"
                    // title="Editar Usuário"
                    disabled
                    className="cursor-not-allowed opacity-30 transition-all"
                    title="Ainda não implementado"
                  >
                    ✏️
                  </button>
                  <button
                    // className="transition-all hover:text-(--error)"
                    // title="Excluir Usuário"
                    disabled
                    className="cursor-not-allowed opacity-30 transition-all"
                    title="Ainda não implementado"
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
