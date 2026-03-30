import Link from 'next/link';

import type { User } from '@/src/web/api';
import { COURSE_NAVIGATION_ITEMS } from '@/src/web/config/course-navigation.constants';

export function UsersManager({ users }: { users: User[] }) {
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
              <th className="p-4 font-bold">Funcionalidades do Curso</th>
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
                <td className="p-4">
                  <div className="flex gap-2">
                    {COURSE_NAVIGATION_ITEMS.map((item) => (
                      <div
                        key={item.key}
                        className="group/tooltip relative"
                        title={item.label}
                      >
                        <Link
                          href={`/dashboard/${item.key}/${u.username}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded transition-all duration-200 hover:bg-(--accent) hover:text-(--foreground)"
                          title={item.label}
                        >
                          <span className="text-base">{item.icon}</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="space-x-3 p-4 text-right">
                  <button
                    disabled
                    className="cursor-not-allowed opacity-30 transition-all"
                    title="Ainda não implementado"
                  >
                    ✏️
                  </button>
                  <button
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
