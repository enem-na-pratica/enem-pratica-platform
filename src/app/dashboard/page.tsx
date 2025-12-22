import { cookies } from "next/headers";
import { Role } from "@/src/core/domain/auth/roles";
import { LogoutButton } from "@/src/ui/components/logout-button";
import { redirect } from "next/navigation";
import {
  AdminDashboard,
  StudentDashboard,
  SuperAdminDashboard,
  TeacherDashboard,
} from "@/src/ui/pages/dashboard";

type UserDTO = {
  id: string;
  name: string;
  username: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};

async function getUser(token: string) {
  const response = await fetch("http://localhost:3000/api/user/me", {
    method: "GET",
    cache: "no-store",
    headers: {
      Cookie: `auth_token=${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Falha ao carregar usuário");
  }

  return response.json();
}

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");

  if (!token) redirect("/login"); // This should never need to run.

  const user = (await getUser(token.value)) as UserDTO;

  const renderDashboard = () => {
    switch (user.role) {
      case "STUDENT":
        return <StudentDashboard user={user} />;
      case "TEACHER":
        return <TeacherDashboard user={user} />;
      case "ADMIN":
        return <AdminDashboard user={user} />;
      case "SUPERADMIN":
        return <SuperAdminDashboard user={user} />;
      default:
        return redirect("/access-denied");
    }
  };

  return (
    <main className="container-center">
      <header className="w-full flex justify-between items-center p-4 border-b">
        <h1>Bem-vindo, {user.name}</h1>
        <LogoutButton />
      </header>
      <div className="mt-4">{renderDashboard()}</div>
    </main>
  );
}
