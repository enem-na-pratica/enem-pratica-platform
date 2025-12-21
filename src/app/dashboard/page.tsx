import { JSX } from "react";
import { cookies } from "next/headers";
import dynamic from "next/dynamic";
import { Role } from "@/src/core/domain/auth/roles";
import { LogoutButton } from "@/src/ui/components/logout-button";

const StudentDashboard = dynamic(() =>
  import("@/src/ui/pages/dashboard").then((mod) => mod.StudentDashboard)
);
const TeacherDashboard = dynamic(() =>
  import("@/src/ui/pages/dashboard").then((mod) => mod.TeacherDashboard)
);
const AdminDashboard = dynamic(() =>
  import("@/src/ui/pages/dashboard").then((mod) => mod.AdminDashboard)
);
const SuperAdminDashboard = dynamic(() =>
  import("@/src/ui/pages/dashboard").then((mod) => mod.SuperAdminDashboard)
);

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
  const token = cookieStore.get("auth_token")!.value;
  const user = (await getUser(token)) as UserDTO;
  console.log(user);
  

  const dashboards: Record<Role, JSX.Element> = {
    STUDENT: <StudentDashboard user={user} />,
    TEACHER: <TeacherDashboard user={user} />,
    ADMIN: <AdminDashboard user={user} />,
    SUPERADMIN: <SuperAdminDashboard user={user} />,
  };

  return (
    <main className="container-center">
      <header className="w-full flex justify-between items-center p-4 border-b">
        <h1>Bem-vindo, {user.name}</h1>
        <LogoutButton />
      </header>

      <div className="mt-4">{dashboards[user.role]}</div>
    </main>
  );
}
