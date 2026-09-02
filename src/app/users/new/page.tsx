import { headers } from 'next/headers';
import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';

import { extractUserRole, makeUserService } from '@/src/web/api';
import { ROLES } from '@/src/web/config';

import { NewUserForm } from './_components/new-user-form';

export default async function NewUserPage() {
  const headersList = await headers();
  type UserCreatorRole = typeof ROLES.ADMIN | typeof ROLES.SUPER_ADMIN;
  const role = extractUserRole(headersList) as UserCreatorRole;

  const listInstructors = await makeUserService().listAvailableInstructors();

  return (
    <div className="flex w-full items-center justify-center bg-(--background) p-1.5">
      <div className="card animate-in fade-in zoom-in w-full max-w-lg border border-(--foreground)/10 shadow-2xl duration-300">
        <header className="mb-6">
          <Link
            href={'/dashboard?tab=users'}
            className="flex items-center gap-1 text-xs font-bold tracking-widest text-(--accent) uppercase transition-all hover:opacity-70"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para listagem
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Novo Usuário</h1>
          <p className="text-sm opacity-50">
            Configure as credenciais e o nível de acesso
          </p>
        </header>

        <NewUserForm
          listInstructors={listInstructors}
          currentUserRole={role}
        />
      </div>
    </div>
  );
}
