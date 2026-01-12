import { UserModel } from "@/src/services/api/models";
import { LogoutButton } from "@/src/ui/components";

export function SuperAdminDashboard({ user }: { user: UserModel }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <LogoutButton />
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-xl font-semibold text-gray-800">
          Dados do Usuário
        </h1>

        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <span className="font-medium">ID:</span> {user.id}
          </p>
          <p>
            <span className="font-medium">Nome:</span> {user.name}
          </p>
          <p>
            <span className="font-medium">Username:</span> {user.username}
          </p>
          <p>
            <span className="font-medium">Role:</span> {user.role}
          </p>
          <p>
            <span className="font-medium">Criado em:</span>{" "}
            {user.createdAt.toLocaleDateString()}
          </p>
          <p>
            <span className="font-medium">Atualizado em:</span>{" "}
            {user.updatedAt.toLocaleDateString()}
          </p>
        </div>
      </div>
    </main>
  );
}
